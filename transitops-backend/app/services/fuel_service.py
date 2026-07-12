from sqlmodel import Session, select

from app.models.fuel_log import FuelLog
from app.schemas.fuel_log import FuelLogCreate, FuelLogUpdate


class FuelService:
    @staticmethod
    def create(session: Session, fuel_data: FuelLogCreate) -> FuelLog:
        fuel_log = FuelLog.model_validate(fuel_data)

        session.add(fuel_log)
        session.commit()
        session.refresh(fuel_log)

        return fuel_log

    @staticmethod
    def get_all(session: Session) -> list[FuelLog]:
        statement = select(FuelLog)
        return session.exec(statement).all()

    @staticmethod
    def get_by_id(session: Session, fuel_id: int) -> FuelLog | None:
        return session.get(FuelLog, fuel_id)

    @staticmethod
    def update(
        session: Session,
        fuel_id: int,
        fuel_data: FuelLogUpdate,
    ) -> FuelLog | None:

        fuel_log = session.get(FuelLog, fuel_id)

        if not fuel_log:
            return None

        update_data = fuel_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(fuel_log, key, value)

        session.add(fuel_log)
        session.commit()
        session.refresh(fuel_log)

        return fuel_log

    @staticmethod
    def delete(session: Session, fuel_id: int) -> bool:

        fuel_log = session.get(FuelLog, fuel_id)

        if not fuel_log:
            return False

        session.delete(fuel_log)
        session.commit()

        return True
