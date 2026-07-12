import enum
from sqlalchemy import Integer, String, ForeignKey, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class AuditStatus(str, enum.Enum):
    VERIFIED = "Verified"
    MISSING = "Missing"
    DAMAGED = "Damaged"

class AuditRecord(Base):
    __tablename__ = "audit_records"
    
    asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("assets.id"), nullable=False)
    audited_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    status: Mapped[AuditStatus] = mapped_column(Enum(AuditStatus), nullable=False)
    notes: Mapped[str] = mapped_column(Text, nullable=True)