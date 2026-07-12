import csv
import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select, func
from typing import Dict, Any

from app.db.database import get_session
from app.models import (
    Vehicle,
    VehicleStatus,
    Trip,
    TripStatus,
    MaintenanceLog,
    FuelLog,
    Driver,
    DriverStatus,
)
from app.core.deps import get_current_user, require_roles

router = APIRouter(prefix="/dashboard", tags=["Dashboard / Reports"])


@router.get("/kpis", response_model=Dict[str, Any])
def get_kpis(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    # 1. Vehicle Counts Grouped by Status
    vehicles = session.exec(select(Vehicle)).all()
    status_counts = {
        VehicleStatus.available.value: 0,
        VehicleStatus.on_trip.value: 0,
        VehicleStatus.in_shop.value: 0,
        VehicleStatus.retired.value: 0,
    }
    for vehicle in vehicles:
        if vehicle.status.value in status_counts:
            status_counts[vehicle.status.value] += 1
        else:
            status_counts[vehicle.status.value] = 1

    # 2. Fleet Utilization Calculation
    total_non_retired = sum(1 for v in vehicles if v.status != VehicleStatus.retired)
    vehicles_on_trip = sum(1 for v in vehicles if v.status == VehicleStatus.on_trip)
    fleet_utilization = (
        (vehicles_on_trip / total_non_retired * 100) if total_non_retired > 0 else 0.0
    )

    # 3. Trip Status Counts (Active and Pending)
    active_trips_count = (
        session.exec(
            select(func.count(Trip.id)).where(Trip.status == TripStatus.dispatched)
        ).one()
        or 0
    )
    pending_trips_count = (
        session.exec(
            select(func.count(Trip.id)).where(Trip.status == TripStatus.draft)
        ).one()
        or 0
    )

    # 4. Drivers On Duty Count
    drivers_on_duty_count = (
        session.exec(
            select(func.count(Driver.id)).where(Driver.status == DriverStatus.on_trip)
        ).one()
        or 0
    )

    # 5. Financials
    total_revenue = session.exec(select(func.sum(Trip.revenue))).one() or 0.0
    total_maintenance = session.exec(select(func.sum(MaintenanceLog.cost))).one() or 0.0
    total_fuel = session.exec(select(func.sum(FuelLog.cost))).one() or 0.0
    total_acquisition = sum(v.acquisition_cost for v in vehicles)

    roi = (
        ((total_revenue - total_maintenance - total_fuel) / total_acquisition)
        if total_acquisition > 0
        else 0.0
    )

    # 6. Fuel Efficiency Calculation from Completed Trips (Distance / Fuel)
    completed_trips = session.exec(
        select(Trip).where(Trip.status == TripStatus.completed)
    ).all()
    total_distance_covered = sum(
        t.actual_distance for t in completed_trips if t.actual_distance
    )
    total_fuel_consumed = sum(
        t.fuel_consumed for t in completed_trips if t.fuel_consumed
    )

    fuel_efficiency = (
        (total_distance_covered / total_fuel_consumed)
        if total_fuel_consumed > 0
        else 0.0
    )

    return {
        "status_distribution": status_counts,
        "fleet_utilization": round(fleet_utilization, 2),
        "active_trips": active_trips_count,
        "pending_trips": pending_trips_count,
        "drivers_on_duty": drivers_on_duty_count,
        "fuel_efficiency": round(fuel_efficiency, 2),
        "financials": {
            "total_revenue": total_revenue,
            "total_maintenance_cost": total_maintenance,
            "total_fuel_cost": total_fuel,
            "total_acquisition_cost": total_acquisition,
            "operational_cost": total_maintenance + total_fuel,
            "overall_roi": round(roi, 4),
        },
    }


@router.get("/fuel-efficiency")
def fuel_efficiency(
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    trips = session.exec(select(Trip)).all()

    results = []

    for trip in trips:
        if trip.actual_distance is None:
            continue

        fuel_logs = session.exec(
            select(FuelLog).where(FuelLog.trip_id == trip.id)
        ).all()

        total_fuel = sum(log.liters for log in fuel_logs)

        efficiency = (
            round(trip.actual_distance / total_fuel, 2) if total_fuel > 0 else 0
        )

        results.append(
            {
                "trip_id": trip.id,
                "vehicle_id": trip.vehicle_id,
                "distance": trip.actual_distance,
                "fuel_consumed": total_fuel,
                "fuel_efficiency": efficiency,
            }
        )

    return results


@router.get("/export-trips")
def export_trips(
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager", "Financial Analyst")),
):
    def generate_csv():
        output = io.StringIO()
        writer = csv.writer(output)

        # Write header
        writer.writerow(
            [
                "Trip ID",
                "Vehicle ID",
                "Driver ID",
                "Source",
                "Destination",
                "Cargo Weight (kg)",
                "Planned Distance (km)",
                "Actual Distance (km)",
                "Fuel Consumed (L)",
                "Revenue ($)",
                "Status",
                "Created At",
                "Completed At",
            ]
        )
        yield output.getvalue()
        output.seek(0)
        output.truncate(0)

        # Write data rows
        trips = session.exec(select(Trip)).all()
        for trip in trips:
            writer.writerow(
                [
                    trip.id,
                    trip.vehicle_id,
                    trip.driver_id,
                    trip.source,
                    trip.destination,
                    trip.cargo_weight,
                    trip.planned_distance,
                    trip.actual_distance,
                    trip.fuel_consumed,
                    trip.revenue,
                    trip.status.value if hasattr(trip.status, "value") else trip.status,
                    trip.created_at.isoformat() if trip.created_at else "",
                    trip.completed_at.isoformat() if trip.completed_at else "",
                ]
            )
            yield output.getvalue()
            output.seek(0)
            output.truncate(0)

    return StreamingResponse(
        generate_csv(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=trips_export.csv"},
    )
