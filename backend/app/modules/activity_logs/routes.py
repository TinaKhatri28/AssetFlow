from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.modules.users.models import User
from app.modules.activity_logs import schemas, service

router = APIRouter()

@router.get("/", response_model=List[schemas.ActivityLogResponse])
def get_activity_logs(
    db: Session = Depends(get_db)
):
    """View the global system activity log."""
    return service.get_recent_logs(db)
