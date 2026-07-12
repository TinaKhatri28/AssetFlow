from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
# In a real implementation, require_role would come from core.deps
# from app.api.v1.deps import require_role
from . import schemas, service, repository

router = APIRouter()

@router.post("/", response_model=schemas.AssetResponse, status_code=status.HTTP_201_CREATED)
def register_asset(
    asset_in: schemas.AssetCreate, 
    db: Session = Depends(get_db)
):
    # This endpoint should be protected by require_role([RoleEnum.ASSET_MANAGER, RoleEnum.ADMIN])
    try:
        return service.register_new_asset(db, asset_in)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.AssetResponse])
def get_assets(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    return repository.list_assets(db, skip=skip, limit=limit)

@router.get("/{asset_id}", response_model=schemas.AssetResponse)
def get_asset(
    asset_id: int, 
    db: Session = Depends(get_db)
):
    asset = repository.get_asset_by_id(db, asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset
