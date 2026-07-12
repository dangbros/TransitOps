from typing import Optional

from pydantic import BaseModel, Field, ConfigDict

from app.models import VehicleStatus


class VehicleCreate(BaseModel):
    registration_number: str = Field(min_length=1, max_length=50)
    name_model: str = Field(min_length=1, max_length=100)
    type: str = Field(min_length=1, max_length=50)
    region: Optional[str] = Field(default=None, max_length=100)

    max_load_capacity: float = Field(gt=0)
    odometer: float = Field(default=0, ge=0)
    acquisition_cost: float = Field(ge=0)

    status: VehicleStatus = VehicleStatus.available


class VehicleUpdate(BaseModel):
    registration_number: Optional[str] = Field(
        default=None, min_length=1, max_length=50
    )
    name_model: Optional[str] = Field(default=None, min_length=1, max_length=100)
    type: Optional[str] = Field(default=None, min_length=1, max_length=50)
    region: Optional[str] = Field(default=None, max_length=100)

    max_load_capacity: Optional[float] = Field(default=None, gt=0)
    odometer: Optional[float] = Field(default=None, ge=0)
    acquisition_cost: Optional[float] = Field(default=None, ge=0)

    status: Optional[VehicleStatus] = None


class VehicleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    registration_number: str
    name_model: str
    type: str
    region: Optional[str]
    max_load_capacity: float
    odometer: float
    acquisition_cost: float
    status: VehicleStatus
