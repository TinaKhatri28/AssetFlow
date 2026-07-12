from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.bookings import repository, schemas, models
from app.modules.assets.models import Asset, AssetStatus

def create_booking(db: Session, booking_in: schemas.BookingCreate, current_user_id: int):
    # 1. Verify asset exists
    asset = db.query(Asset).filter(Asset.id == booking_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # 2. Check for time conflicts
    if repository.check_conflict(db, booking_in.asset_id, booking_in.start_time, booking_in.end_time):
        raise HTTPException(status_code=409, detail="Time slot is already booked for this asset.")
    
    # 3. Create booking
    new_booking = models.Booking(
        asset_id=booking_in.asset_id,
        user_id=current_user_id,
        start_time=booking_in.start_time,
        end_time=booking_in.end_time,
        purpose=booking_in.purpose,
        status=models.BookingStatus.CONFIRMED # Auto-confirming for MVP
    )
    return repository.create_booking(db, new_booking)

def list_my_bookings(db: Session, user_id: int):
    return repository.get_user_bookings(db, user_id)