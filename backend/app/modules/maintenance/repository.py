from sqlalchemy.orm import Session
from app.modules.maintenance.models import MaintenanceRecord

def create_record(db: Session, record: MaintenanceRecord) -> MaintenanceRecord:
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def get_record(db: Session, record_id: int) -> MaintenanceRecord:
    return db.query(MaintenanceRecord).filter(MaintenanceRecord.id == record_id).first()

def get_all_records(db: Session):
    return db.query(MaintenanceRecord).order_by(MaintenanceRecord.created_at.desc()).all()