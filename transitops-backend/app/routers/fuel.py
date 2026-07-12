from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional, List

from app.db.database import get_session
from app.models import FuelLog, Vehicle, Trip
from app.schemas.fuel_log import FuelLogCreate, FuelLogUpdate, FuelLogRead
from app.core.deps import get_current_user, require_roles

router = APIRouter(prefix="/fuel", tags=["Fuel Logs"])


@router.post("", response_model=FuelLogRead)
def create_fuel_log(
    payload: FuelLogCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager", "Financial Analyst")),
):
    vehicle = session.get(Vehicle, payload.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if payload.trip_id:
        trip = session.get(Trip, payload.trip_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

    fuel_log = FuelLog(**payload.model_dump())

    session.add(fuel_log)
    session.commit()
    session.refresh(fuel_log)

    return fuel_log


@router.get("", response_model=List[FuelLogRead])
def list_fuel_logs(
    vehicle_id: Optional[int] = None,
    trip_id: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    query = select(FuelLog)

    if vehicle_id:
        query = query.where(FuelLog.vehicle_id == vehicle_id)

    if trip_id:
        query = query.where(FuelLog.trip_id == trip_id)

    return session.exec(query).all()


@router.get("/{fuel_id}", response_model=FuelLogRead)
def get_fuel_log(
    fuel_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    fuel_log = session.get(FuelLog, fuel_id)

    if not fuel_log:
        raise HTTPException(status_code=404, detail="Fuel log not found")

    return fuel_log


@router.put("/{fuel_id}", response_model=FuelLogRead)
def update_fuel_log(
    fuel_id: int,
    payload: FuelLogUpdate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager", "Financial Analyst")),
):
    fuel_log = session.get(FuelLog, fuel_id)

    if not fuel_log:
        raise HTTPException(status_code=404, detail="Fuel log not found")

    if payload.vehicle_id is not None:
        vehicle = session.get(Vehicle, payload.vehicle_id)
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")

    if payload.trip_id is not None:
        trip = session.get(Trip, payload.trip_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(fuel_log, key, value)

    session.add(fuel_log)
    session.commit()
    session.refresh(fuel_log)

    return fuel_log


@router.delete("/{fuel_id}")
def delete_fuel_log(
    fuel_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager")),
):
    fuel_log = session.get(FuelLog, fuel_id)

    if not fuel_log:
        raise HTTPException(status_code=404, detail="Fuel log not found")

    session.delete(fuel_log)
    session.commit()

    return {"message": "Fuel log deleted"}
