import enum
from sqlalchemy import String, Boolean, ForeignKey, Enum, Integer, Date, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class AssetStatus(str, enum.Enum):
    AVAILABLE = "Available"
    ALLOCATED = "Allocated"
    RESERVED = "Reserved"
    UNDER_MAINTENANCE = "Under Maintenance"
    LOST = "Lost"
    RETIRED = "Retired"
    DISPOSED = "Disposed"

class Asset(Base):
    __tablename__ = "assets"
    
    # Auto-generated code like AF-0001
    asset_tag: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False) 
    name: Mapped[str] = mapped_column(String, nullable=False)
    serial_number: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=True)
    
    category_id: Mapped[int] = mapped_column(Integer, ForeignKey("categories.id"), nullable=False)
    department_id: Mapped[int] = mapped_column(Integer, ForeignKey("departments.id"), nullable=True) 
    
    status: Mapped[AssetStatus] = mapped_column(Enum(AssetStatus), default=AssetStatus.AVAILABLE, nullable=False)
    
    acquisition_date: Mapped[Date] = mapped_column(Date, nullable=False)
    acquisition_cost: Mapped[float] = mapped_column(Integer, nullable=True) # Usually best to store money in cents
    
    condition: Mapped[str] = mapped_column(String, nullable=True)
    location: Mapped[str] = mapped_column(String, nullable=True)
    is_bookable: Mapped[bool] = mapped_column(Boolean, default=False)
    
    notes: Mapped[str] = mapped_column(Text, nullable=True)