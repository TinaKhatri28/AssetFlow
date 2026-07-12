from pydantic import BaseModel
from typing import Optional
from app.modules.transfers.models import TransferStatus
from datetime import datetime

class TransferCreate(BaseModel):
    asset_id: int
    to_user_id: int
    reason: Optional[str] = None

class TransferResponse(BaseModel):
    id: int
    asset_id: int
    from_user_id: int
    to_user_id: int
    status: TransferStatus
    reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True