from sqlalchemy.orm import Session
from app.modules.audits.models import AuditRecord, AuditCycle

def create_cycle(db: Session, cycle: AuditCycle) -> AuditCycle:
    db.add(cycle)
    db.commit()
    db.refresh(cycle)
    return cycle

def get_cycles(db: Session):
    return db.query(AuditCycle).order_by(AuditCycle.start_date.desc()).all()

def create_audit(db: Session, audit: AuditRecord) -> AuditRecord:
    db.add(audit)
    db.commit()
    db.refresh(audit)
    return audit

def get_cycle_audits(db: Session, cycle_id: int):
    return db.query(AuditRecord).filter(AuditRecord.audit_cycle_id == cycle_id).order_by(AuditRecord.created_at.desc()).all()