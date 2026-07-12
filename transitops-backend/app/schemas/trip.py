from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from app.models import TripStatus


class TripCreate(BaseModel):
    vehicle_id: int = Field(gt=0)
    driver_id: int = Field(gt=0)

    source: str = Field(min_length=1, max_length=255)
    destination: str = Field(min_length=1, max_length=255)

    cargo_weight: float = Field(gt=0)
    planned_distance: float = Field(gt=0)


class TripCompleteRequest(BaseModel):
    actual_distance: float = Field(ge=0)
    final_odometer: float = Field(ge=0)
    fuel_consumed: float = Field(default=0, ge=0)
    revenue: float = Field(default=0, ge=0)


class TripResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    vehicle_id: int
    driver_id: int

    source: str
    destination: str

    cargo_weight: float
    planned_distance: float
    actual_distance: Optional[float]
    fuel_consumed: Optional[float]
    revenue: float

    status: TripStatus

    created_at: datetime
    completed_at: Optional[datetime]
