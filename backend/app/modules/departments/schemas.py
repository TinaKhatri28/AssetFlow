from pydantic import BaseModel
from typing import Optional

class DepartmentBase(BaseModel):
    name: str
    head_user_id: Optional[int] = None
    parent_id: Optional[int] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int
    is_active: bool
    
    class Config:
        from_attributes = True