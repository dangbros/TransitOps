from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.models import DriverStatus


class DriverCreate(BaseModel):
    name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: Optional[str] = None
    safety_score: float = 1.0
    status: DriverStatus = DriverStatus.available


class DriverUpdate(BaseModel):
    name: Optional[str] = None
    license_category: Optional[str] = None
    license_expiry_date: Optional[date] = None
    contact_number: Optional[str] = None
    safety_score: Optional[float] = None
    status: Optional[DriverStatus] = None


class DriverResponse(BaseModel):
    id: int
    name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: Optional[str]
    safety_score: float
    status: DriverStatus