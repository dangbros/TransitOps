import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ExpenseCreate(BaseModel):
    vehicle_id: int = Field(gt=0)
    trip_id: Optional[int] = Field(default=None, gt=0)

    category: str = Field(min_length=1, max_length=50)

    amount: float = Field(gt=0)

    date: datetime.date

    description: Optional[str] = Field(default=None, max_length=500)


class ExpenseUpdate(BaseModel):
    vehicle_id: Optional[int] = Field(default=None, gt=0)
    trip_id: Optional[int] = Field(default=None, gt=0)

    category: Optional[str] = Field(default=None, min_length=1, max_length=50)

    amount: Optional[float] = Field(default=None, gt=0)

    date: Optional[datetime.date] = None

    description: Optional[str] = Field(default=None, max_length=500)


class ExpenseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    vehicle_id: int
    trip_id: Optional[int]

    category: str
    amount: float
    date: datetime.date
    description: Optional[str]
