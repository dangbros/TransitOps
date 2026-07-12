from datetime import date

from fastapi import HTTPException
from sqlmodel import Session, select

from app.models import (
    MaintenanceLog,
    MaintenanceStatus,
    Vehicle,
    VehicleStatus,
)


class MaintenanceService:
    @staticmethod
    def create(
        session: Session,
        vehicle: Vehicle,
        description: str,
        cost: float,
    ) -> MaintenanceLog:

        if vehicle.status != VehicleStatus.available:
            raise HTTPException(
                status_code=400,
                detail="Vehicle must be available before entering maintenance.",
            )

        maintenance = MaintenanceLog(
            vehicle_id=vehicle.id,
            description=description,
            cost=cost,
            start_date=date.today(),
            status=MaintenanceStatus.open,
        )

        vehicle.status = VehicleStatus.in_shop

        session.add(maintenance)
        session.add(vehicle)

        session.commit()

        session.refresh(maintenance)

        return maintenance

    @staticmethod
    def get_all(session: Session):
        return session.exec(select(MaintenanceLog)).all()

    @staticmethod
    def complete(
        session: Session,
        maintenance: MaintenanceLog,
    ):
        if maintenance.status == MaintenanceStatus.closed:
            raise HTTPException(
                status_code=400,
                detail="Maintenance is already completed.",
            )

        vehicle = session.get(
            Vehicle,
            maintenance.vehicle_id,
        )

        maintenance.status = MaintenanceStatus.closed
        maintenance.end_date = date.today()

        vehicle.status = VehicleStatus.available

        session.add(maintenance)
        session.add(vehicle)

        session.commit()

        session.refresh(maintenance)

        return maintenance
