from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AllocationCreate(BaseModel):
    asset_id: int
    user_id: int
    expected_return_date: Optional[datetime] = None
    notes: Optional[str] = None

class AllocationReturn(BaseModel):
    notes: Optional[str] = "Returned in good condition"

class AllocationResponse(BaseModel):
    id: int
    asset_id: int
    user_id: int
    allocated_by_id: int
    allocation_date: datetime
    expected_return_date: Optional[datetime]
    return_date: Optional[datetime]
    notes: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True