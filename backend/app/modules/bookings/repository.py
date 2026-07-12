from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime
from app.modules.bookings.models import Booking, BookingStatus

def create_booking(db: Session, booking: Booking) -> Booking:
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

def check_conflict(db: Session, asset_id: int, start: datetime, end: datetime) -> bool:
    """Returns True if there is a conflict, False if the slot is free."""
    conflict = db.query(Booking).filter(
        Booking.asset_id == asset_id,
        Booking.status == BookingStatus.CONFIRMED,
        or_(
            and_(Booking.start_time <= start, Booking.end_time > start), # overlaps start
            and_(Booking.start_time < end, Booking.end_time >= end),     # overlaps end
            and_(Booking.start_time >= start, Booking.end_time <= end)   # completely contained
        )
    ).first()
    return conflict is not None

def get_user_bookings(db: Session, user_id: int):
    return db.query(Booking).filter(Booking.user_id == user_id).order_by(Booking.start_time.desc()).all()