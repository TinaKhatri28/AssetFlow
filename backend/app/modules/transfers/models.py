import enum
from sqlalchemy import Integer, String, ForeignKey, Enum, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class TransferStatus(str, enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"

class TransferRequest(Base):
    __tablename__ = "transfer_requests"
    
    asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("assets.id"), nullable=False)
    from_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    to_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    
    status: Mapped[TransferStatus] = mapped_column(Enum(TransferStatus), default=TransferStatus.PENDING, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=True)