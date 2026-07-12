from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.v1.deps import get_current_user
from app.modules.users.models import User
from app.modules.returns import schemas, service

router = APIRouter()

@router.post("/", response_model=schemas.ReturnResponse)
def process_asset_return(
    req_in: schemas.ReturnCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Process an asset return and automatically make the asset available again."""
    return service.process_return(db, req_in, current_user.id)