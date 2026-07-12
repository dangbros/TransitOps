from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import date, datetime
from typing import Optional, List

from app.db.database import get_session
from app.models import Trip, TripStatus, Vehicle, VehicleStatus, Driver, DriverStatus, FuelLog
from app.schemas.trip import TripCreate, TripCompleteRequest, TripResponse

router = APIRouter(prefix="/trips", tags=["Trips"])


@router.post("", response_model=TripResponse)
def create_trip(payload: TripCreate, session: Session = Depends(get_session)):
    vehicle = session.get(Vehicle, payload.vehicle_id)
    driver = session.get(Driver, payload.driver_id)

    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    if payload.cargo_weight > vehicle.max_load_capacity:
        raise HTTPException(status_code=400, detail="Cargo weight exceeds vehicle max load capacity")

    trip = Trip(**payload.model_dump(), status=TripStatus.draft)
    session.add(trip)
    session.commit()
    session.refresh(trip)
    return trip


@router.get("", response_model=List[TripResponse])
def list_trips(
    status: Optional[TripStatus] = None,
    session: Session = Depends(get_session),
):
    query = select(Trip)
    if status:
        query = query.where(Trip.status == status)
    return session.exec(query).all()


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, session: Session = Depends(get_session)):
    trip = session.get(Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@router.post("/{trip_id}/dispatch", response_model=TripResponse)
def dispatch_trip(trip_id: int, session: Session = Depends(get_session)):
    trip = session.get(Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.status != TripStatus.draft:
        raise HTTPException(status_code=400, detail="Trip must be in Draft status to dispatch")

    vehicle = session.get(Vehicle, trip.vehicle_id)
    driver = session.get(Driver, trip.driver_id)

    # vehicle must be Available (not Retired/In Shop/On Trip)
    if vehicle.status != VehicleStatus.available:
        raise HTTPException(status_code=400, detail=f"Vehicle is not available (current status: {vehicle.status})")

    # driver must be Available, not Suspended, license not expired
    if driver.status != DriverStatus.available:
        raise HTTPException(status_code=400, detail=f"Driver is not available (current status: {driver.status})")
    if driver.license_expiry_date < date.today():
        raise HTTPException(status_code=400, detail="Driver license has expired")

    # cargo weight check (also re-validated here for safety)
    if trip.cargo_weight > vehicle.max_load_capacity:
        raise HTTPException(status_code=400, detail="Cargo weight exceeds vehicle max load capacity")

    trip.status = TripStatus.dispatched
    vehicle.status = VehicleStatus.on_trip
    driver.status = DriverStatus.on_trip

    session.add_all([trip, vehicle, driver])
    session.commit()
    session.refresh(trip)
    return trip


@router.post("/{trip_id}/complete", response_model=TripResponse)
def complete_trip(trip_id: int, payload: TripCompleteRequest, session: Session = Depends(get_session)):
    trip = session.get(Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.status != TripStatus.dispatched:
        raise HTTPException(status_code=400, detail="Only dispatched trips can be completed")

    vehicle = session.get(Vehicle, trip.vehicle_id)
    driver = session.get(Driver, trip.driver_id)

    trip.status = TripStatus.completed
    trip.actual_distance = payload.actual_distance
    trip.fuel_consumed = payload.fuel_consumed
    trip.revenue = payload.revenue
    trip.completed_at = datetime.utcnow()

    vehicle.odometer = payload.final_odometer
    vehicle.status = VehicleStatus.available
    driver.status = DriverStatus.available

    session.add_all([trip, vehicle, driver])

    # Auto-create fuel log if fuel was consumed
    if payload.fuel_consumed > 0:
        fuel_log = FuelLog(
            vehicle_id=vehicle.id,
            trip_id=trip.id,
            liters=payload.fuel_consumed,
            cost=0,
            date=date.today(),
            odometer_at_fuel=payload.final_odometer,
        )
        session.add(fuel_log)

    session.commit()
    session.refresh(trip)
    return trip


@router.post("/{trip_id}/cancel", response_model=TripResponse)
def cancel_trip(trip_id: int, session: Session = Depends(get_session)):
    trip = session.get(Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    if trip.status != TripStatus.dispatched:
        raise HTTPException(status_code=400, detail="Only dispatched trips can be cancelled")

    vehicle = session.get(Vehicle, trip.vehicle_id)
    driver = session.get(Driver, trip.driver_id)

    trip.status = TripStatus.cancelled
    vehicle.status = VehicleStatus.available
    driver.status = DriverStatus.available

    session.add_all([trip, vehicle, driver])
    session.commit()
    session.refresh(trip)
    return trip