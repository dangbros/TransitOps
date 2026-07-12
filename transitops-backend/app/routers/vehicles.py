from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional, List

from app.db.database import get_session
from app.models import Vehicle, VehicleStatus
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleResponse
from app.core.deps import get_current_user, require_roles

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.post("", response_model=VehicleResponse)
def create_vehicle(
    payload: VehicleCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager")),
):
    existing = session.exec(
        select(Vehicle).where(Vehicle.registration_number == payload.registration_number)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Registration number already exists")

    vehicle = Vehicle(**payload.model_dump())
    session.add(vehicle)
    session.commit()
    session.refresh(vehicle)
    return vehicle


@router.get("", response_model=List[VehicleResponse])
def list_vehicles(
    status: Optional[VehicleStatus] = None,
    type: Optional[str] = None,
    region: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    query = select(Vehicle)
    if status:
        query = query.where(Vehicle.status == status)
    if type:
        query = query.where(Vehicle.type == type)
    if region:
        query = query.where(Vehicle.region == region)

    vehicles = session.exec(query).all()
    return vehicles


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(
    vehicle_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    vehicle = session.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    payload: VehicleUpdate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager")),
):
    vehicle = session.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(vehicle, key, value)

    session.add(vehicle)
    session.commit()
    session.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager")),
):
    vehicle = session.get(Vehicle, vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    session.delete(vehicle)
    session.commit()
    return {"message": "Vehicle deleted"}