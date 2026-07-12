from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.v1.deps import require_role
from app.modules.users.models import RoleEnum
from .models import Category
from . import schemas

router = APIRouter()

@router.post("/", response_model=schemas.CategoryResponse)
def create_category(
    cat_in: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([RoleEnum.ADMIN, RoleEnum.ASSET_MANAGER]))
):
    db_cat = Category(**cat_in.model_dump())
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

@router.get("/", response_model=List[schemas.CategoryResponse])
def get_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Category).offset(skip).limit(limit).all()