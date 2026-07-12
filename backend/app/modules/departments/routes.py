from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy.exc import IntegrityError
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

@router.post("/", response_model=schemas.DepartmentResponse)
def create_department(
    dept_in: schemas.DepartmentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([RoleEnum.ADMIN]))
):
    try:
        db_dept = Department(**dept_in.model_dump())
        db.add(db_dept)
        db.commit()
        db.refresh(db_dept)
        return db_dept
    except IntegrityError:
        db.rollback() # Discard the failed transaction
        raise HTTPException(
            status_code=400, 
            detail="A department with this name already exists."
        )
    
@router.patch("/{department_id}", response_model=schemas.DepartmentResponse)
def update_department(
    department_id: int,
    dept_in: schemas.DepartmentUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(require_role([RoleEnum.ADMIN]))
):
    """Update an existing department."""
    # Find the department in the database
    db_dept = db.query(Department).filter(Department.id == department_id).first()
    if not db_dept:
        raise HTTPException(status_code=404, detail="Department not found")
        
    # Apply the changes
    update_data = dept_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_dept, field, value)
        
    try:
        db.commit()
        db.refresh(db_dept)
        return db_dept
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="A department with this name already exists.")