from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.modules.users.models import User
from app.modules.audits import schemas, service

router = APIRouter()

@router.post("/cycles", response_model=schemas.AuditCycleResponse, status_code=201)
def create_audit_cycle(
    cycle_in: schemas.AuditCycleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.create_audit_cycle(db, cycle_in, current_user.id)

@router.get("/cycles", response_model=List[schemas.AuditCycleResponse])
def get_all_cycles(db: Session = Depends(get_db)):
    return service.list_cycles(db)

@router.post("/scans", response_model=schemas.AuditResponse, status_code=201)
def log_inventory_scan(
    audit_in: schemas.AuditCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.log_audit(db, audit_in, current_user.id)

@router.get("/cycles/{cycle_id}/scans", response_model=List[schemas.AuditResponse])
def get_cycle_history(
    cycle_id: int,
    db: Session = Depends(get_db)
):
    return service.list_scans_for_cycle(db, cycle_id)