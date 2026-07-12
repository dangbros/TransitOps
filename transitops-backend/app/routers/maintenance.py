from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.db.database import get_session
from app.models import Vehicle, MaintenanceLog
from app.schemas.maintenance import (
    MaintenanceCreate,
    MaintenanceResponse,
)
from app.services.maintenance_service import MaintenanceService

router = APIRouter(
    prefix="/maintenance",
    tags=["Maintenance"],
)


@router.post(
    "",
    response_model=MaintenanceResponse,
)
def create_maintenance(
    payload: MaintenanceCreate,
    session: Session = Depends(get_session),
):

    vehicle = session.get(
        Vehicle,
        payload.vehicle_id,
    )

    if vehicle is None:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found.",
        )

    return MaintenanceService.create(
        session=session,
        vehicle=vehicle,
        description=payload.description,
        cost=payload.cost,
    )


@router.get(
    "",
    response_model=list[MaintenanceResponse],
)
def get_all_maintenance(
    session: Session = Depends(get_session),
):
    return MaintenanceService.get_all(session)


@router.post(
    "/{maintenance_id}/complete",
    response_model=MaintenanceResponse,
)
def complete_maintenance(
    maintenance_id: int,
    session: Session = Depends(get_session),
):
    maintenance = session.get(
        MaintenanceLog,
        maintenance_id,
    )

    if maintenance is None:
        raise HTTPException(
            status_code=404,
            detail="Maintenance record not found.",
        )

    return MaintenanceService.complete(
        session=session,
        maintenance=maintenance,
    )
