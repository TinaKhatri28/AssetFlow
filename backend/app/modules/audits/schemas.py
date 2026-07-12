from pydantic import BaseModel
from typing import Optional
from app.modules.audits.models import AuditStatus
from datetime import datetime

class AuditCreate(BaseModel):
    asset_id: int
    status: AuditStatus
    notes: Optional[str] = None

class AuditResponse(BaseModel):
    id: int
    asset_id: int
    audited_by: int
    status: AuditStatus
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True