from sqlalchemy.orm import Session
from app.modules.activity_logs.models import ActivityLog

def log_action(db: Session, user_id: int, action: str, details: str = None):
    new_log = ActivityLog(
        user_id=user_id,
        action=action,
        details=details
    )
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

def get_recent_logs(db: Session, limit: int = 50):
    return db.query(ActivityLog).order_by(ActivityLog.created_at.desc()).limit(limit).all()
