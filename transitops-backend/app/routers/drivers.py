from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional, List

from app.db.database import get_session
from app.models import Driver, DriverStatus
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse

router = APIRouter(prefix="/drivers", tags=["Drivers"])


@router.post("", response_model=DriverResponse)
def create_driver(payload: DriverCreate, session: Session = Depends(get_session)):
    existing = session.exec(
        select(Driver).where(Driver.license_number == payload.license_number)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="License number already exists")

    driver = Driver(**payload.model_dump())
    session.add(driver)
    session.commit()
    session.refresh(driver)
    return driver


@router.get("", response_model=List[DriverResponse])
def list_drivers(
    status: Optional[DriverStatus] = None,
    session: Session = Depends(get_session),
):
    query = select(Driver)
    if status:
        query = query.where(Driver.status == status)

    drivers = session.exec(query).all()
    return drivers


@router.get("/{driver_id}", response_model=DriverResponse)
def get_driver(driver_id: int, session: Session = Depends(get_session)):
    driver = session.get(Driver, driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver


@router.put("/{driver_id}", response_model=DriverResponse)
def update_driver(driver_id: int, payload: DriverUpdate, session: Session = Depends(get_session)):
    driver = session.get(Driver, driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(driver, key, value)

    session.add(driver)
    session.commit()
    session.refresh(driver)
    return driver


@router.delete("/{driver_id}")
def delete_driver(driver_id: int, session: Session = Depends(get_session)):
    driver = session.get(Driver, driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    session.delete(driver)
    session.commit()
    return {"message": "Driver deleted"}