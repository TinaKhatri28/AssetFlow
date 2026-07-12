from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.audits import repository, schemas, models
from app.modules.assets.models import Asset, AssetStatus

def log_audit(db: Session, audit_in: schemas.AuditCreate, current_user_id: int):
    # 1. Verify asset exists
    asset = db.query(Asset).filter(Asset.id == audit_in.asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # 2. Create the audit record
    new_audit = models.AuditRecord(
        asset_id=audit_in.asset_id,
        audited_by=current_user_id,
        status=audit_in.status,
        notes=audit_in.notes
    )
    repository.create_audit(db, new_audit)
    
    # 3. STATE MACHINE: Update the asset based on the audit findings!
    if audit_in.status == models.AuditStatus.MISSING:
        asset.status = AssetStatus.LOST
    elif audit_in.status == models.AuditStatus.DAMAGED:
        asset.condition = "Damaged"
        
    db.commit()
    return new_audit

def list_asset_audits(db: Session, asset_id: int):
    return repository.get_asset_audits(db, asset_id)