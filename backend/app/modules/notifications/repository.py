from sqlalchemy.orm import Session
from app.modules.notifications.models import AppNotification

def get_user_notifications(db: Session, user_id: int):
    return db.query(AppNotification).filter(AppNotification.user_id == user_id).order_by(AppNotification.created_at.desc()).all()

def get_notification(db: Session, notification_id: int):
    return db.query(AppNotification).filter(AppNotification.id == notification_id).first()

def create_notification(db: Session, notification: AppNotification):
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
