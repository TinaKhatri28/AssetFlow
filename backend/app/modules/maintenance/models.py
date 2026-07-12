import enum
from sqlalchemy import Integer, String, ForeignKey, Enum, Text, Float
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class MaintenanceStatus(str, enum.Enum):
    SCHEDULED = "Scheduled"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"
    
    asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("assets.id"), nullable=False)
    reported_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    issue_description: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[MaintenanceStatus] = mapped_column(Enum(MaintenanceStatus), default=MaintenanceStatus.IN_PROGRESS, nullable=False)
    
    # Optional fields updated when repair is finished
    repair_notes: Mapped[str] = mapped_column(Text, nullable=True)
    cost: Mapped[float] = mapped_column(Float, nullable=True)