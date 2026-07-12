from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.modules.users.models import User
from app.modules.maintenance import schemas, service

router = APIRouter()

@router.post("/", response_model=schemas.MaintenanceResponse, status_code=201)
def report_issue(
    ticket_in: schemas.MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Open a maintenance ticket and lock the asset."""
    return service.open_ticket(db, ticket_in, current_user.id)

@router.patch("/{ticket_id}", response_model=schemas.MaintenanceResponse)
def update_ticket(
    ticket_id: int,
    update_in: schemas.MaintenanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Complete a repair and unlock the asset."""
    return service.complete_ticket(db, ticket_id, update_in)

@router.get("/", response_model=List[schemas.MaintenanceResponse])
def get_all_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all maintenance history."""
    return service.list_tickets(db)