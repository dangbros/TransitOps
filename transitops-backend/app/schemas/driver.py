from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models import DriverStatus


class DriverCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    license_number: str = Field(min_length=1, max_length=50)
    license_category: str = Field(min_length=1, max_length=20)
    license_expiry_date: date

    contact_number: Optional[str] = Field(default=None, max_length=20)

    safety_score: float = Field(default=1.0, ge=0, le=1)

    status: DriverStatus = DriverStatus.available


class DriverUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    license_category: Optional[str] = Field(default=None, min_length=1, max_length=20)
    license_expiry_date: Optional[date] = None

    contact_number: Optional[str] = Field(default=None, max_length=20)

    safety_score: Optional[float] = Field(default=None, ge=0, le=1)

    status: Optional[DriverStatus] = None


class DriverResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    license_number: str
    license_category: str
    license_expiry_date: date
    contact_number: Optional[str]
    safety_score: float
    status: DriverStatus
