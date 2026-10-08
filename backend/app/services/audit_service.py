from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from app.models.audit_log import AuditLog
from app.schemas.audit import AuditLogResponse, AuditLogCreate

class AuditService:
    @staticmethod
    def create_log(db: Session, data: AuditLogCreate):
        new_log = AuditLog(
            id=data.id or f"AUD-{str(uuid.uuid4())[:8].upper()}",
            timestamp=datetime.utcnow(),
            event=data.event,
            actor=data.actor,
            organization=data.organization,
            evidence_id=data.evidenceId or "N/A",
            event_id=data.eventId or f"EVT-{str(uuid.uuid4())[:8].upper()}",
            verification=data.verification or "VERIFIED",
            reference=data.reference or f"0x{uuid.uuid4().hex}",
            details=data.details or "Cryptographic audit trail record committed to ledger."
        )
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return AuditService._format_response(new_log)

    @staticmethod
    def get_logs(db: Session, event: str = None, organization: str = None, search: str = None):
        query = db.query(AuditLog)
        if event and event != 'ALL':
            query = query.filter(AuditLog.event == event)
        if organization and organization != 'ALL':
            query = query.filter(AuditLog.organization.ilike(f"%{organization}%"))
        if search:
            search = search.lower()
            query = query.filter(
                (AuditLog.id.ilike(f"%{search}%")) |
                (AuditLog.evidence_id.ilike(f"%{search}%")) |
                (AuditLog.actor.ilike(f"%{search}%")) |
                (AuditLog.event.ilike(f"%{search}%")) |
                (AuditLog.details.ilike(f"%{search}%"))
            )
            
        results = query.order_by(AuditLog.timestamp.desc()).all()
        return [AuditService._format_response(r) for r in results]

    @staticmethod
    def _format_response(a: AuditLog) -> AuditLogResponse:
        return AuditLogResponse(
            id=a.id,
            timestamp=a.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC') if a.timestamp else "",
            event=a.event,
            actor=a.actor,
            organization=a.organization,
            evidenceId=a.evidence_id,
            eventId=a.event_id,
            verification=a.verification,
            reference=a.reference,
            details=a.details
        )
