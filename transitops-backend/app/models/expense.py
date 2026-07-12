from sqlmodel import SQLModel, Field
from datetime import date
from typing import Optional

class Expense(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vehicle_id: int = Field(foreign_key="vehicle.id")
    trip_id: Optional[int] = Field(default=None, foreign_key="trip.id")
    category: str  # Toll, Maintenance, Other
    amount: float
    date: date
    description: Optional[str] = None