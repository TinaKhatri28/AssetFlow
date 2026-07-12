from sqlalchemy.orm import Session
from app.modules.returns.models import ReturnRecord

def create_return(db: Session, return_record: ReturnRecord):
    db.add(return_record)
    db.commit()
    db.refresh(return_record)
    return return_record