from fastapi import APIRouter, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.custody import CustodyEventCreate, CustodyEventResponse
from app.services.custody_service import CustodyService

router = APIRouter()

@router.get("/events", response_model=List[CustodyEventResponse])
def get_events(
    evidenceId: str = None,
    event: str = None,
    organization: str = None,
    search: str = None,
    db: Session = Depends(get_db)
):
    return CustodyService.get_events(db, evidenceId, event, organization, search)

@router.get("/events/{evidence_id}", response_model=List[CustodyEventResponse])
def get_events_by_evidence(evidence_id: str, db: Session = Depends(get_db)):
    return CustodyService.get_events_by_evidence_id(db, evidence_id)

@router.post("/events", response_model=CustodyEventResponse)
def create_event(event: CustodyEventCreate, db: Session = Depends(get_db)):
    return CustodyService.create_event(db, event)
