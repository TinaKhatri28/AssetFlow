from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.modules.notifications import repository, schemas, models

def get_notifications_for_user(db: Session, user_id: int):
    return repository.get_user_notifications(db, user_id)

def mark_notification_read(db: Session, notification_id: int, user_id: int):
    notification = repository.get_notification(db, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

def send_notification(db: Session, user_id: int, message: str):
    new_notif = models.AppNotification(
        user_id=user_id,
        message=message
    )
    return repository.create_notification(db, new_notif)
