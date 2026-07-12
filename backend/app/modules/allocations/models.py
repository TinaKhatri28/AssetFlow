from sqlalchemy import String, ForeignKey, Integer, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from typing import Optional
from app.db.base import Base

class Allocation(Base):
    __tablename__ = "allocations"
    
    # What asset is being checked out, and to whom?
    asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("assets.id"), nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Who authorized this checkout? (e.g., the IT Admin's user ID)
    allocated_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Time tracking
    allocation_date: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    expected_return_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    return_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    notes: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    # True = Employee currently has it. False = They returned it.
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)