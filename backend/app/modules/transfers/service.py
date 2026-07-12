from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.transfers import repository, schemas, models
from app.modules.allocations.models import Allocation

def request_transfer(db: Session, req_in: schemas.TransferCreate, current_user_id: int):
    # 1. Verify the current user actually holds the asset!
    active_alloc = db.query(Allocation).filter(
        Allocation.asset_id == req_in.asset_id,
        Allocation.user_id == current_user_id,
        Allocation.is_active == True
    ).first()
    if not active_alloc:
        raise HTTPException(status_code=400, detail="You cannot transfer an asset you do not currently hold.")
    
    # 2. Create the Pending Transfer Request
    new_req = models.TransferRequest(
        asset_id=req_in.asset_id,
        from_user_id=current_user_id,
        to_user_id=req_in.to_user_id,
        reason=req_in.reason,
        status=models.TransferStatus.PENDING
    )
    return repository.create_transfer(db, new_req)

def approve_transfer(db: Session, transfer_id: int, manager_id: int):
    transfer = repository.get_transfer(db, transfer_id)
    if not transfer or transfer.status != models.TransferStatus.PENDING:
        raise HTTPException(status_code=400, detail="Invalid or already processed transfer.")

    # 1. End old allocation
    old_alloc = db.query(Allocation).filter(
        Allocation.asset_id == transfer.asset_id,
        Allocation.is_active == True
    ).first()
    if old_alloc:
        old_alloc.is_active = False

    # 2. Create new allocation for the receiving user
    new_alloc = Allocation(
        asset_id=transfer.asset_id,
        user_id=transfer.to_user_id,
        allocated_by_id=manager_id,
        is_active=True,
        notes=f"Transferred from User {transfer.from_user_id}"
    )
    db.add(new_alloc)
    
    # 3. Update transfer status
    transfer.status = models.TransferStatus.APPROVED
    db.commit()
    db.refresh(transfer)
    return transfer