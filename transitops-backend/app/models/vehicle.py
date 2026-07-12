from sqlmodel import SQLModel, Field
from enum import Enum
from typing import Optional

class VehicleStatus(str, Enum):
    available = "Available"
    on_trip = "On Trip"
    in_shop = "In Shop"
    retired = "Retired"

class Vehicle(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    registration_number: str = Field(unique=True, index=True)
    name_model: str
    type: str
    region: Optional[str] = None
    max_load_capacity: float
    odometer: float = 0
    acquisition_cost: float
    status: VehicleStatus = VehicleStatus.available