from sqlalchemy.orm import Session
from app.modules.transfers.models import TransferRequest

def create_transfer(db: Session, transfer: TransferRequest):
    db.add(transfer)
    db.commit()
    db.refresh(transfer)
    return transfer

def get_transfer(db: Session, transfer_id: int):
    return db.query(TransferRequest).filter(TransferRequest.id == transfer_id).first()