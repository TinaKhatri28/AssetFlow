from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.api.v1.deps import require_role
from app.modules.users.models import Department, RoleEnum
from . import schemas

router = APIRouter()

@router.post("/", response_model=schemas.DepartmentResponse)
def create_department(
    dept_in: schemas.DepartmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([RoleEnum.ADMIN]))
):
    db_dept = Department(**dept_in.model_dump())
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

@router.get("/", response_model=List[schemas.DepartmentResponse])
def get_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Department).offset(skip).limit(limit).all()