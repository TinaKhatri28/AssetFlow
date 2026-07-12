from sqlalchemy import Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base import Base

class ReturnRecord(Base):
    __tablename__ = "return_records"
    
    asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("assets.id"), nullable=False)
    returned_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    received_by_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    return_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    condition_notes: Mapped[str] = mapped_column(Text, nullable=True)