from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.modules.users.models import User
from app.modules.bookings import schemas, service

router = APIRouter()

@router.post("/", response_model=schemas.BookingResponse, status_code=201)
def create_booking(
    booking_in: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new resource booking."""
    return service.create_booking(db, booking_in, current_user.id)

@router.get("/me", response_model=List[schemas.BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all bookings for the current logged-in user."""
    return service.list_my_bookings(db, current_user.id)