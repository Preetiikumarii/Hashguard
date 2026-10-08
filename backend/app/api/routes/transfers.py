from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database.database import get_db
from app.schemas.transfer import TransferCreate, TransferResponse
from app.services.transfer_service import TransferService

router = APIRouter()

@router.get("", response_model=List[TransferResponse])
def get_transfers(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return TransferService.get_all(db, status, search)

@router.post("", response_model=TransferResponse)
def create_transfer(transfer: TransferCreate, db: Session = Depends(get_db)):
    return TransferService.create(db, transfer)

@router.post("/{transfer_id}/accept", response_model=TransferResponse)
def accept_transfer(transfer_id: str, db: Session = Depends(get_db)):
    updated = TransferService.accept(db, transfer_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Transfer not found")
    return updated
