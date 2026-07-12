from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.v1.deps import require_role, get_current_user
from app.modules.users.models import RoleEnum, User
from . import schemas, service, repository

router = APIRouter()

@router.post("/checkout", response_model=schemas.AllocationResponse)
def checkout_asset(
    alloc_in: schemas.AllocationCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([RoleEnum.ADMIN, RoleEnum.ASSET_MANAGER]))
):
    """Assign an asset to an employee (Asset Managers only)."""
    try:
        return service.allocate_asset(db, alloc_in, admin_user_id=current_user.id)
    except Exception as e: 
        # This will cleanly catch our IllegalStateTransitionError if it fails!
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{asset_id}/return", response_model=schemas.AllocationResponse)
def return_asset(
    asset_id: int,
    return_in: schemas.AllocationReturn,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([RoleEnum.ADMIN, RoleEnum.ASSET_MANAGER]))
):
    """Mark an asset as returned and make it available again."""
    try:
        return service.return_asset(db, asset_id, return_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{asset_id}/history", response_model=List[schemas.AllocationResponse])
def get_asset_history(
    asset_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """View the entire checkout history for a specific asset."""
    return repository.get_allocation_history_for_asset(db, asset_id)