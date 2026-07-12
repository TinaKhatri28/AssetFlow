from sqlalchemy.orm import Session
from datetime import datetime
from . import repository, schemas, models

# We import the asset service so we can talk to the Asset State Machine!
from app.modules.assets import service as asset_service
from app.modules.assets.models import AssetStatus

def allocate_asset(db: Session, alloc_in: schemas.AllocationCreate, admin_user_id: int) -> models.Allocation:
    # 1. Check if someone else already has it
    active_alloc = repository.get_active_allocation_for_asset(db, alloc_in.asset_id)
    if active_alloc:
        raise ValueError("This asset is already checked out to someone else!")

    # 2. Update the Asset's status (This triggers our strict State Machine!)
    asset_service.update_asset_status(db, alloc_in.asset_id, AssetStatus.ALLOCATED)

    # 3. Create the ledger entry
    new_allocation = models.Allocation(
        asset_id=alloc_in.asset_id,
        user_id=alloc_in.user_id,
        allocated_by_id=admin_user_id,
        notes=alloc_in.notes,
        expected_return_date=alloc_in.expected_return_date,
        is_active=True
    )
    return repository.create_allocation(db, new_allocation)

def return_asset(db: Session, asset_id: int, return_in: schemas.AllocationReturn) -> models.Allocation:
    # 1. Find the active allocation ledger entry
    alloc = repository.get_active_allocation_for_asset(db, asset_id)
    if not alloc:
        raise ValueError("This asset is not currently checked out to anyone.")

    # 2. Update the Asset's status back to AVAILABLE
    asset_service.update_asset_status(db, asset_id, AssetStatus.AVAILABLE)

    # 3. Close the ledger entry (mark it inactive and stamp the return time)
    alloc.is_active = False
    alloc.return_date = datetime.utcnow()
    if return_in.notes:
        alloc.notes = f"{alloc.notes or ''} | Return Note: {return_in.notes}"
        
    db.commit()
    db.refresh(alloc)
    return alloc