from pydantic import BaseModel
from typing import Optional, List
from app.modules.audits.models import AuditStatus, CycleStatus
from datetime import datetime

class AuditCycleCreate(BaseModel):
    name: str

class AuditCycleResponse(BaseModel):
    id: int
    name: str
    created_by_id: int
    start_date: datetime
    end_date: Optional[datetime] = None
    status: CycleStatus
    
    class Config:
        from_attributes = True

class AuditCreate(BaseModel):
    audit_cycle_id: int
    asset_id: int
    status: AuditStatus
    notes: Optional[str] = None

class AuditResponse(BaseModel):
    id: int
    audit_cycle_id: int
    asset_id: int
    audited_by: int
    status: AuditStatus
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True