from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.modules.users.models import User
from app.modules.reports import service, schemas

router = APIRouter()

@router.get("/utilization-by-dept", response_model=List[schemas.DeptUtilization])
def get_dept_util(db: Session = Depends(get_db)):
    return service.get_dept_utilization(db)

@router.get("/maintenance-frequency", response_model=List[schemas.MonthlyMaintenance])
def get_maint_freq(db: Session = Depends(get_db)):
    return service.get_maintenance_frequency(db)

@router.get("/most-used", response_model=List[schemas.AssetUsage])
def get_most_used(db: Session = Depends(get_db)):
    return service.get_most_used(db)

@router.get("/idle", response_model=List[schemas.IdleAsset])
def get_idle(db: Session = Depends(get_db)):
    return service.get_idle_assets(db)

@router.get("/due-maintenance", response_model=List[schemas.DueMaintenance])
def get_due(db: Session = Depends(get_db)):
    return service.get_due_maintenance(db)
