from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.modules.users.models import User
from app.modules.audits import schemas, service

router = APIRouter()

@router.post("/", response_model=schemas.AuditResponse, status_code=201)
def log_inventory_audit(
    audit_in: schemas.AuditCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Log a physical audit scan of an asset."""
    return service.log_audit(db, audit_in, current_user.id)

@router.get("/asset/{asset_id}", response_model=List[schemas.AuditResponse])
def get_asset_history(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """View the entire audit history for a specific asset."""
    return service.list_asset_audits(db, asset_id)