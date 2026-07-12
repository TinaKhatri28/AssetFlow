from pydantic import BaseModel
from typing import Optional
from app.modules.maintenance.models import MaintenanceStatus

class MaintenanceCreate(BaseModel):
    asset_id: int
    issue_description: str

class MaintenanceUpdate(BaseModel):
    status: MaintenanceStatus
    repair_notes: Optional[str] = None
    cost: Optional[float] = None

class MaintenanceResponse(BaseModel):
    id: int
    asset_id: int
    reported_by: int
    issue_description: str
    status: MaintenanceStatus
    repair_notes: Optional[str] = None
    cost: Optional[float] = None
    
    class Config:
        from_attributes = True