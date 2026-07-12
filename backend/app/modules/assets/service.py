from sqlalchemy.orm import Session
from . import repository, schemas
from .models import Asset, AssetStatus
from .lifecycle import assert_valid_transition

def generate_asset_tag(db: Session, category_id: int) -> str:
    # MVP approach for Hackathon: Just count total assets and add 1
    # Note: At production scale, this would use a Sequence table to avoid race conditions!
    count = db.query(Asset).count()
    return f"AF-{(count + 1):04d}"

def register_new_asset(db: Session, asset_in: schemas.AssetCreate) -> Asset:
    # 1. Generate the unique AF-0000 code
    new_tag = generate_asset_tag(db, asset_in.category_id)
    
    # 2. Persist to Database
    asset = repository.create_asset(db, asset_in, new_tag)
    
    # 3. Here is where you would eventually queue a background task (e.g. generate QR code)
    
    return asset

def update_asset_status(db: Session, asset_id: int, new_status: AssetStatus) -> Asset:
    asset = repository.get_asset_by_id(db, asset_id)
    if not asset:
        raise ValueError("Asset not found")
        
    # Strictly enforce our State Machine!
    assert_valid_transition(asset.status, new_status)
    
    asset.status = new_status
    db.commit()
    db.refresh(asset)
    return asset