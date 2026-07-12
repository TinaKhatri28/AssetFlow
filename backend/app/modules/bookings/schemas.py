from pydantic import BaseModel, model_validator
from datetime import datetime, timezone
from typing import Optional
from app.modules.bookings.models import BookingStatus

class BookingBase(BaseModel):
    asset_id: int
    start_time: datetime
    end_time: datetime
    purpose: Optional[str] = None

class BookingCreate(BookingBase):
    @model_validator(mode='after')
    def check_time_range(self):
        if self.start_time >= self.end_time:
            raise ValueError('end_time must be after start_time')
        
        # Make sure start_time has a timezone before comparing with utcnow()
        now = datetime.now(timezone.utc)
        start = self.start_time if self.start_time.tzinfo else self.start_time.replace(tzinfo=timezone.utc)
        if start < now:
            raise ValueError('Cannot book assets in the past')
        return self

class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: BookingStatus

    class Config:
        from_attributes = True