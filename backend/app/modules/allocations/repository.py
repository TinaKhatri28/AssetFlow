from sqlalchemy.orm import Session
from .models import Allocation
from typing import List, Optional

def get_active_allocation_for_asset(db: Session, asset_id: int) -> Optional[Allocation]:
    return db.query(Allocation).filter(
        Allocation.asset_id == asset_id, 
        Allocation.is_active == True
    ).first()

def create_allocation(db: Session, allocation: Allocation) -> Allocation:
    db.add(allocation)
    db.commit()
    db.refresh(allocation)
    return allocation

def get_allocation_history_for_asset(db: Session, asset_id: int) -> List[Allocation]:
    return db.query(Allocation).filter(Allocation.asset_id == asset_id).order_by(Allocation.allocation_date.desc()).all()