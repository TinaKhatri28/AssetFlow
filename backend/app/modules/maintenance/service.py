from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.maintenance import repository, schemas, models
from app.modules.assets.models import Asset, AssetStatus

def open_ticket(db: Session, ticket_in: schemas.MaintenanceCreate, current_user_id: int):
    # 1. Verify asset exists
    asset = db.query(Asset).filter(Asset.id == ticket_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # 2. STATE MACHINE: Lock the asset
    asset.status = AssetStatus.UNDER_MAINTENANCE
    db.commit()
    
    # 3. Create ticket
    new_ticket = models.MaintenanceRecord(
        asset_id=ticket_in.asset_id,
        reported_by=current_user_id,
        issue_description=ticket_in.issue_description,
        status=models.MaintenanceStatus.IN_PROGRESS
    )
    return repository.create_record(db, new_ticket)

def complete_ticket(db: Session, ticket_id: int, update_in: schemas.MaintenanceUpdate):
    ticket = repository.get_record(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Maintenance ticket not found")

    # Update ticket details
    ticket.status = update_in.status
    if update_in.repair_notes:
        ticket.repair_notes = update_in.repair_notes
    if update_in.cost is not None:
        ticket.cost = update_in.cost
    
    db.commit()

    # STATE MACHINE: If completed or cancelled, unlock the asset
    if update_in.status in [models.MaintenanceStatus.COMPLETED, models.MaintenanceStatus.CANCELLED]:
        asset = db.query(Asset).filter(Asset.id == ticket.asset_id).first()
        if asset:
            asset.status = AssetStatus.AVAILABLE
            db.commit()
            
    db.refresh(ticket)
    return ticket

def list_tickets(db: Session):
    return repository.get_all_records(db)