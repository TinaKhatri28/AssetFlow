from sqlalchemy.orm import Session
from app.modules.audits.models import AuditRecord

def create_audit(db: Session, audit: AuditRecord) -> AuditRecord:
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit

def get_asset_audits(db: Session, asset_id: int):
    return db.query(AuditRecord).filter(AuditRecord.asset_id == asset_id).order_by(AuditRecord.created_at.desc()).all()