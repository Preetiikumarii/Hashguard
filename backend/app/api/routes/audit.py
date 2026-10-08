from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.database import get_db
from app.schemas.audit import AuditLogResponse, AuditLogCreate
from app.services.audit_service import AuditService

router = APIRouter()

@router.get("", response_model=List[AuditLogResponse])
def get_audit_logs(
    event: str = None,
    organization: str = None,
    search: str = None,
    db: Session = Depends(get_db)
):
    return AuditService.get_logs(db, event, organization, search)

@router.post("", response_model=AuditLogResponse)
def create_audit_log(
    payload: AuditLogCreate,
    db: Session = Depends(get_db)
):
    return AuditService.create_log(db, payload)
