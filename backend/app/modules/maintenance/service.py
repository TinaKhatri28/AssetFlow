from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.maintenance import repository, schemas, models
from app.modules.assets.models import Asset, AssetStatus

def open_ticket(db: Session, ticket_in: schemas.MaintenanceCreate, current_user_id: int):
    asset = db.query(Asset).filter(Asset.id == ticket_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Lock the asset immediately so nobody books a broken asset while it waits for approval
    asset.status = AssetStatus.UNDER_MAINTENANCE
    
    new_ticket = models.MaintenanceRecord(
        asset_id=ticket_in.asset_id,
        reported_by=current_user_id,
        issue_description=ticket_in.issue_description,
        status=models.MaintenanceStatus.PENDING
    )
    db.commit()
    return repository.create_record(db, new_ticket)

def update_ticket(db: Session, ticket_id: int, update_in: schemas.MaintenanceUpdate):
    ticket = repository.get_record(db, ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Maintenance ticket not found")

    ticket.status = update_in.status
    if update_in.repair_notes:
        ticket.repair_notes = update_in.repair_notes
    if update_in.cost is not None:
        ticket.cost = update_in.cost
    
    db.commit()

    # State Machine: Unlock the asset if the manager rejected it, or if it finished!
    if update_in.status in [models.MaintenanceStatus.COMPLETED, models.MaintenanceStatus.CANCELLED, models.MaintenanceStatus.REJECTED]:
        asset = db.query(Asset).filter(Asset.id == ticket.asset_id).first()
        if asset:
            asset.status = AssetStatus.AVAILABLE
            db.commit()
            
    db.refresh(ticket)
    return ticket

def list_tickets(db: Session):
    return repository.get_all_records(db)