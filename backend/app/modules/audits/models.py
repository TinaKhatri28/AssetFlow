import enum
from sqlalchemy import Integer, String, ForeignKey, Enum, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base import Base

class AuditStatus(str, enum.Enum):
    VERIFIED = "Verified"
    MISSING = "Missing"
    DAMAGED = "Damaged"

class CycleStatus(str, enum.Enum):
    ACTIVE = "Active"
    CLOSED = "Closed"

class AuditCycle(Base):
    __tablename__ = "audit_cycles"
    
    name: Mapped[str] = mapped_column(String, nullable=False)
    created_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[CycleStatus] = mapped_column(Enum(CycleStatus), default=CycleStatus.ACTIVE)

class AuditRecord(Base):
    __tablename__ = "audit_records"
    
    audit_cycle_id: Mapped[int] = mapped_column(Integer, ForeignKey("audit_cycles.id"), nullable=False)
    asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("assets.id"), nullable=False)
    audited_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    status: Mapped[AuditStatus] = mapped_column(Enum(AuditStatus), nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=True)