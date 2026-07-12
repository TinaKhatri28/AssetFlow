from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.modules.users.models import User
from app.modules.transfers import schemas, service

router = APIRouter()

@router.post("/", response_model=schemas.TransferResponse)
def request_asset_transfer(
    req_in: schemas.TransferCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.request_transfer(db, req_in, current_user.id)

@router.post("/{transfer_id}/approve", response_model=schemas.TransferResponse)
def approve_asset_transfer(
    transfer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return service.approve_transfer(db, transfer_id, current_user.id)