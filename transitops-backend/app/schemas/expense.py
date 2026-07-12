from pydantic import BaseModel, Field
import datetime
from typing import Optional


class ExpenseCreate(BaseModel):
    vehicle_id: int
    trip_id: Optional[int] = None
    category: str  # Toll, Maintenance, Other
    amount: float = Field(..., gt=0)
    date: datetime.date
    description: Optional[str] = None


class ExpenseUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    trip_id: Optional[int] = None
    category: Optional[str] = None
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[datetime.date] = None
    description: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    vehicle_id: int
    trip_id: Optional[int]
    category: str
    amount: float
    date: datetime.date
    description: Optional[str]

