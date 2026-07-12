from sqlmodel import SQLModel, Field
from enum import Enum
from datetime import date, datetime
from typing import Optional

class TripStatus(str, Enum):
    draft = "Draft"
    dispatched = "Dispatched"
    completed = "Completed"
    cancelled = "Cancelled"

class Trip(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vehicle_id: int = Field(foreign_key="vehicle.id")
    driver_id: int = Field(foreign_key="driver.id")
    source: str
    destination: str
    cargo_weight: float
    planned_distance: float
    actual_distance: Optional[float] = None
    fuel_consumed: Optional[float] = None
    revenue: float = 0
    status: TripStatus = TripStatus.draft
    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None