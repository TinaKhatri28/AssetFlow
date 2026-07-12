from pydantic import BaseModel, EmailStr
from typing import Optional
from .models import RoleEnum

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    department_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[RoleEnum] = None
    is_active: Optional[bool] = None
    department_id: Optional[int] = None

class UserResponse(UserBase):
    id: int
    role: RoleEnum
    is_active: bool
    
    class Config:
        from_attributes = True
