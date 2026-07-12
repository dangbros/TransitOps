from datetime import date
from typing import Optional

from pydantic import BaseModel


class FuelLogCreate(BaseModel):
    vehicle_id: int
    trip_id: Optional[int] = None
    liters: float
    cost: float
    date: date
    odometer_at_fuel: Optional[float] = None


class FuelLogUpdate(BaseModel):
    vehicle_id: Optional[int] = None
    trip_id: Optional[int] = None
    liters: Optional[float] = None
    cost: Optional[float] = None
    date: Optional[date] = None
    odometer_at_fuel: Optional[float] = None


class FuelLogRead(BaseModel):
    id: int
    vehicle_id: int
    trip_id: Optional[int]
    liters: float
    cost: float
    date: date
    odometer_at_fuel: Optional[float]

    class Config:
        from_attributes = True
