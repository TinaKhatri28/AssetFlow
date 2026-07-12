from sqlalchemy.orm import Session
from .models import Asset, AssetStatus
from .schemas import AssetCreate
from typing import List, Optional

def get_asset_by_id(db: Session, asset_id: int) -> Optional[Asset]:
    return db.query(Asset).filter(Asset.id == asset_id).first()

def get_asset_by_tag(db: Session, asset_tag: str) -> Optional[Asset]:
    return db.query(Asset).filter(Asset.asset_tag == asset_tag).first()

def create_asset(db: Session, asset_in: AssetCreate, generated_tag: str) -> Asset:
    db_asset = Asset(
        **asset_in.model_dump(),
        asset_tag=generated_tag,
        status=AssetStatus.AVAILABLE
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def list_assets(db: Session, skip: int = 0, limit: int = 100) -> List[Asset]:
    return db.query(Asset).offset(skip).limit(limit).all()