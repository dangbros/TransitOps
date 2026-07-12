from sqlmodel import SQLModel, Field
from datetime import date
from typing import Optional

class FuelLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vehicle_id: int = Field(foreign_key="vehicle.id")
    trip_id: Optional[int] = Field(default=None, foreign_key="trip.id")
    liters: float
    cost: float
    date: date
    odometer_at_fuel: Optional[float] = None