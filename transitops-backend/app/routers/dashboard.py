import csv
import io
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select, func
from typing import Dict, Any

from app.db.database import get_session
from app.models import Vehicle, VehicleStatus, Trip, MaintenanceLog, FuelLog
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

    # 3. Vehicle ROI Calculation
    total_revenue = session.exec(select(func.sum(Trip.revenue))).one() or 0.0
    total_maintenance = session.exec(select(func.sum(MaintenanceLog.cost))).one() or 0.0
    total_fuel = session.exec(select(func.sum(FuelLog.cost))).one() or 0.0
    total_acquisition = sum(v.acquisition_cost for v in vehicles)

    roi = (
        ((total_revenue - total_maintenance - total_fuel) / total_acquisition)
        if total_acquisition > 0
        else 0.0
    )

    return {
        "status_distribution": status_counts,
        "fleet_utilization": round(fleet_utilization, 2),
        "financials": {
            "total_revenue": total_revenue,
            "total_maintenance_cost": total_maintenance,
            "total_fuel_cost": total_fuel,
            "total_acquisition_cost": total_acquisition,
            "overall_roi": round(roi, 4),
        },
    }


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
