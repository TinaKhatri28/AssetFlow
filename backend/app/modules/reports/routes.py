from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.modules.users.models import User
from app.modules.reports import service

router = APIRouter()

@router.get("/utilization")
def get_asset_utilization(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get trends on asset utilization (most-used vs idle)"""
    return service.get_utilization_trends(db)

@router.get("/maintenance-frequency")
def get_maintenance_frequency(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get maintenance frequency by category/asset"""
    return service.get_maintenance_frequency(db)
