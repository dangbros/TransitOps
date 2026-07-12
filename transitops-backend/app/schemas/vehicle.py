from pydantic import BaseModel
from typing import Optional
from app.models import VehicleStatus


class VehicleCreate(BaseModel):
    registration_number: str
    name_model: str
    type: str
    region: Optional[str] = None
    max_load_capacity: float
    odometer: float = 0
    acquisition_cost: float
    status: VehicleStatus = VehicleStatus.available


class VehicleUpdate(BaseModel):
    name_model: Optional[str] = None
    type: Optional[str] = None
    region: Optional[str] = None
    max_load_capacity: Optional[float] = None
    odometer: Optional[float] = None
    acquisition_cost: Optional[float] = None
    status: Optional[VehicleStatus] = None


class VehicleResponse(BaseModel):
    id: int
    registration_number: str
    name_model: str
    type: str
    region: Optional[str]
    max_load_capacity: float
    odometer: float
    acquisition_cost: float
    status: VehicleStatus