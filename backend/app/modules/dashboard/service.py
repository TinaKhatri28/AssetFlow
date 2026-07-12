from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.modules.assets.models import Asset, AssetStatus
from app.modules.bookings.models import Booking, BookingStatus
from app.modules.transfers.models import TransferRequest, TransferStatus
from app.modules.allocations.models import Allocation

def get_stats(db: Session):
    total_assets = db.query(Asset).count()
    allocated_assets = db.query(Asset).filter(Asset.status == AssetStatus.ALLOCATED).count()
    maintenance_assets = db.query(Asset).filter(Asset.status == AssetStatus.UNDER_MAINTENANCE).count()
    
    active_bookings = db.query(Booking).filter(Booking.status == BookingStatus.CONFIRMED).count()
    pending_transfers = db.query(TransferRequest).filter(TransferRequest.status == TransferStatus.PENDING).count()
    
    # Count allocations that are active and whose expected return date has passed
    upcoming_returns = db.query(Allocation).filter(
        Allocation.is_active == True,
        Allocation.expected_return_date < func.now()
    ).count()

    return {
        "total_assets": total_assets,
        "allocated_assets": allocated_assets,
        "maintenance_assets": maintenance_assets,
        "active_bookings": active_bookings,
        "pending_transfers": pending_transfers,
        "upcoming_returns": upcoming_returns
    }
