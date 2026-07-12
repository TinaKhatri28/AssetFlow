from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReturnCreate(BaseModel):
    asset_id: int
    condition_notes: Optional[str] = None

class ReturnResponse(BaseModel):
    id: int
    asset_id: int
    returned_by_id: int
    received_by_id: int
    return_date: datetime
    condition_notes: Optional[str] = None

    class Config:
        from_attributes = True