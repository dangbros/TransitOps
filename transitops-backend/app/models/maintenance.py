from sqlmodel import SQLModel, Field
from enum import Enum
from datetime import date
from typing import Optional

class MaintenanceStatus(str, Enum):
    open = "Open"
    closed = "Closed"

class MaintenanceLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    vehicle_id: int = Field(foreign_key="vehicle.id")
    description: str
    cost: float = 0
    start_date: date
    end_date: Optional[date] = None
    status: MaintenanceStatus = MaintenanceStatus.open