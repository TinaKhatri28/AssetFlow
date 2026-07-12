from sqlalchemy.orm import Session
from . import repository, schemas
from .models import Asset, AssetStatus
from .lifecycle import assert_valid_transition

def generate_asset_tag(db: Session, category_id: int) -> str:
    # In a real system, you'd query a sequence table to get the next number safely.
    # For now, we do a simple count (which has race conditions, but suffices for a hackathon MVP).
    count = db.query(Asset).count()
    return f"AF-{(count + 1):04d}"

def register_new_asset(db: Session, asset_in: schemas.AssetCreate) -> Asset:
    # 1. Generate the AF-0000 code
    new_tag = generate_asset_tag(db, asset_in.category_id)
    
    # 2. Persist to DB
    asset = repository.create_asset(db, asset_in, new_tag)
    
    # 3. Queue any background tasks (like generating QR code PDF)
    # e.g., generate_qr_task.delay(asset.id)
    
    return asset

def update_asset_status(db: Session, asset_id: int, new_status: AssetStatus) -> Asset:
    asset = repository.get_asset_by_id(db, asset_id)
    if not asset:
        raise ValueError("Asset not found")
        
    # Check if this transition is legal
    assert_valid_transition(asset.status, new_status)
    
    asset.status = new_status
    db.commit()
    db.refresh(asset)
    return asset
