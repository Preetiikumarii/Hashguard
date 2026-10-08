from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.verification import VerificationRequest, VerificationResponse
from app.services.verification_service import VerificationService

router = APIRouter()

@router.post("/verify", response_model=VerificationResponse)
def verify_artifact(request: VerificationRequest, db: Session = Depends(get_db)):
    return VerificationService.verify(db, request)
