from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from .models import AssetStatus

class AssetBase(BaseModel):
    name: str
    serial_number: Optional[str] = None
    category_id: int
    department_id: Optional[int] = None
    acquisition_date: date
    acquisition_cost: Optional[int] = None
    condition: Optional[str] = "New"
    location: Optional[str] = None
    is_bookable: bool = False
    notes: Optional[str] = None

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    condition: Optional[str] = None
    location: Optional[str] = None
    status: Optional[AssetStatus] = None

class AssetResponse(AssetBase):
    id: int
    asset_tag: str
    status: AssetStatus
    
    class Config:
        from_attributes = True
