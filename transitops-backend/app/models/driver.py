from sqlmodel import SQLModel, Field
from enum import Enum
from datetime import date
from typing import Optional

class DriverStatus(str, Enum):
    available = "Available"
    on_trip = "On Trip"
    off_duty = "Off Duty"
    suspended = "Suspended"

class Driver(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    license_number: str = Field(unique=True)
    license_category: str
    license_expiry_date: date
    contact_number: Optional[str] = None
    safety_score: float = 1.0
    status: DriverStatus = DriverStatus.available