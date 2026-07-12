from datetime import date
from typing import Optional

from pydantic import BaseModel


class MaintenanceCreate(BaseModel):
    vehicle_id: int
    description: str
    cost: float = 0


class MaintenanceClose(BaseModel):
    end_date: date


class MaintenanceResponse(BaseModel):
    id: int
    vehicle_id: int
    description: str
    cost: float
    start_date: date
    end_date: Optional[date]
    status: str

    model_config = {"from_attributes": True}
