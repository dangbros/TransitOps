from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models import TripStatus


class TripCreate(BaseModel):
    vehicle_id: int
    driver_id: int
    source: str
    destination: str
    cargo_weight: float
    planned_distance: float


class TripCompleteRequest(BaseModel):
    actual_distance: float
    final_odometer: float
    fuel_consumed: float = 0
    revenue: float = 0


class TripResponse(BaseModel):
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