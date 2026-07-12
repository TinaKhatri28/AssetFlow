from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from app.modules.returns import repository, schemas, models
from app.modules.allocations.models import Allocation
from app.modules.assets.models import Asset, AssetStatus

def process_return(db: Session, req_in: schemas.ReturnCreate, received_by_id: int):
    # 1. Find the active allocation
    active_alloc = db.query(Allocation).filter(
        Allocation.asset_id == req_in.asset_id,
        Allocation.is_active == True
    ).first()
    
    if not active_alloc:
        raise HTTPException(status_code=400, detail="This asset is not currently allocated to anyone.")

    # 2. Mark the allocation as returned
    active_alloc.is_active = False
    active_alloc.return_date = datetime.utcnow()

    # 3. Mark the Asset as AVAILABLE
    asset = db.query(Asset).filter(Asset.id == req_in.asset_id).first()
    if asset:
        asset.status = AssetStatus.AVAILABLE

    # 4. Create the Return Record
    new_return = models.ReturnRecord(
        asset_id=req_in.asset_id,
        returned_by_id=active_alloc.user_id,
        received_by_id=received_by_id,
        condition_notes=req_in.condition_notes
    )
    
    db.commit()
    return repository.create_return(db, new_return)