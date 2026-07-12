import enum
from sqlalchemy import Column, String, Boolean, ForeignKey, Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class RoleEnum(str, enum.Enum):
    ADMIN = "Admin"
    ASSET_MANAGER = "Asset Manager"
    DEPARTMENT_HEAD = "Department Head"
    EMPLOYEE = "Employee"

class User(Base):
    __tablename__ = "users"
    
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    full_name: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[RoleEnum] = mapped_column(Enum(RoleEnum), default=RoleEnum.EMPLOYEE, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    
    department_id: Mapped[int] = mapped_column(Integer, ForeignKey("departments.id"), nullable=True)
    # department = relationship("Department", back_populates="users")
    
class Department(Base):
    __tablename__ = "departments"
    
    name: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    head_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    parent_id: Mapped[int] = mapped_column(Integer, ForeignKey("departments.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
