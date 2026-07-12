from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.audits import repository, schemas, models
from app.modules.assets.models import Asset, AssetStatus

def create_audit_cycle(db: Session, cycle_in: schemas.AuditCycleCreate, manager_id: int):
    new_cycle = models.AuditCycle(
        name=cycle_in.name,
        created_by_id=manager_id,
        status=models.CycleStatus.ACTIVE
    )
    return repository.create_cycle(db, new_cycle)

def list_cycles(db: Session):
    return repository.get_cycles(db)

def log_audit(db: Session, audit_in: schemas.AuditCreate, current_user_id: int):
    # 1. Verify cycle is active
    cycle = db.query(models.AuditCycle).filter(models.AuditCycle.id == audit_in.audit_cycle_id).first()
    if not cycle or cycle.status != models.CycleStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Audit Cycle is not active")

    # 2. Verify asset exists
    asset = db.query(Asset).filter(Asset.id == audit_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # 3. Create audit record
    new_audit = models.AuditRecord(
        audit_cycle_id=audit_in.audit_cycle_id,
        asset_id=audit_in.asset_id,
        audited_by=current_user_id,
        status=audit_in.status,
        notes=audit_in.notes
    )
    repository.create_audit(db, new_audit)
    
    # 4. State Machine Updates
    if audit_in.status == models.AuditStatus.MISSING:
        asset.status = AssetStatus.LOST
    elif audit_in.status == models.AuditStatus.DAMAGED:
        asset.condition = "Damaged"
        
    db.commit()
    return new_audit

def list_scans_for_cycle(db: Session, cycle_id: int):
    return repository.get_cycle_audits(db, cycle_id)