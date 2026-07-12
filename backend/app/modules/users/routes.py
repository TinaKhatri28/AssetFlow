from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.v1.deps import get_current_user, require_role
from app.core.security import get_password_hash
from . import schemas
from .models import User, RoleEnum

router = APIRouter()

@router.get("/me", response_model=schemas.UserResponse)
def read_user_me(
    current_user: User = Depends(get_current_user)
):
    """Get current user profile."""
    return current_user

@router.post("/", response_model=schemas.UserResponse)
def create_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([RoleEnum.ADMIN]))
):
    """Create a new user (Admin only)."""
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        department_id=user_in.department_id,
        role=RoleEnum.EMPLOYEE # Default role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user