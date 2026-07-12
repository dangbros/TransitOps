import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FuelLogCreate(BaseModel):
    vehicle_id: int = Field(gt=0)
    trip_id: Optional[int] = Field(default=None, gt=0)

    liters: float = Field(gt=0)
    cost: float = Field(ge=0)

    date: datetime.date

    odometer_at_fuel: Optional[float] = Field(default=None, ge=0)


class FuelLogUpdate(BaseModel):
    vehicle_id: Optional[int] = Field(default=None, gt=0)
    trip_id: Optional[int] = Field(default=None, gt=0)

    liters: Optional[float] = Field(default=None, gt=0)
    cost: Optional[float] = Field(default=None, ge=0)

    date: Optional[datetime.date] = None

    odometer_at_fuel: Optional[float] = Field(default=None, ge=0)


class FuelLogRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    vehicle_id: int
    trip_id: Optional[int]

    liters: float
    cost: float
    date: datetime.date

    odometer_at_fuel: Optional[float]
