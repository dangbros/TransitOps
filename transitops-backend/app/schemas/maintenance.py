import datetime

from pydantic import BaseModel, ConfigDict, Field


class MaintenanceCreate(BaseModel):
    vehicle_id: int = Field(gt=0)

    description: str = Field(min_length=1, max_length=500)

    cost: float = Field(default=0, ge=0)


class MaintenanceClose(BaseModel):
    end_date: datetime.date


class MaintenanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    vehicle_id: int

    description: str
    cost: float

    start_date: datetime.date
    end_date: datetime.date | None

    status: str
