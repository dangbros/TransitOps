from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.db.database import get_session
from app.models import Vehicle
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
