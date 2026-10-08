import uuid
from sqlalchemy.orm import Session
from app.models.custody_event import CustodyEvent
from app.schemas.custody import CustodyEventCreate, CustodyEventResponse
from app.crypto.signatures import sign_manifest

class CustodyService:
    @staticmethod
    def get_events(db: Session, evidence_id: str = None, event: str = None, organization: str = None, search: str = None):
        query = db.query(CustodyEvent)
        if evidence_id:
            query = query.filter(CustodyEvent.evidence_id == evidence_id)
        if event and event != 'ALL':
            query = query.filter(CustodyEvent.event == event)
        if organization and organization != 'ALL':
            query = query.filter(CustodyEvent.organization.ilike(f"%{organization}%"))
        if search:
            search = search.lower()
            query = query.filter(
                (CustodyEvent.event_id.ilike(f"%{search}%")) |
                (CustodyEvent.evidence_id.ilike(f"%{search}%")) |
                (CustodyEvent.actor.ilike(f"%{search}%"))
            )
            
        results = query.order_by(CustodyEvent.sequence_number.desc()).all()
        return [CustodyService._format_response(r) for r in results]

    @staticmethod
    def get_events_by_evidence_id(db: Session, evidence_id: str):
        results = db.query(CustodyEvent).filter(CustodyEvent.evidence_id == evidence_id).order_by(CustodyEvent.sequence_number.desc()).all()
        return [CustodyService._format_response(r) for r in results]

    @staticmethod
    def create_event(db: Session, data: CustodyEventCreate):
        event_id = f"EVT-{str(uuid.uuid4())[:8].upper()}"
        
        # Generate signature
        manifest = {
            "evidence_id": data.evidenceId,
            "event": data.event,
            "actor": data.actor,
            "organization": data.organization,
            "hash": data.hash
        }
        sig = sign_manifest(manifest)
        
        tx_ref = "0x" + str(uuid.uuid4().hex)
        
        new_event = CustodyEvent(
            event_id=event_id,
            evidence_id=data.evidenceId,
            event=data.event,
            actor=data.actor,
            organization=data.organization,
            hash=data.hash,
            notes=data.notes,
            parent_id=data.parentId,
            signature=sig,
            tx_ref=tx_ref
        )
        db.add(new_event)
        db.commit()
        db.refresh(new_event)
        return CustodyService._format_response(new_event)

    @staticmethod
    def _format_response(e: CustodyEvent) -> CustodyEventResponse:
        return CustodyEventResponse(
            eventId=e.event_id,
            evidenceId=e.evidence_id,
            event=e.event,
            actor=e.actor,
            organization=e.organization,
            timestamp=e.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC') if e.timestamp else "",
            hash=e.hash,
            verification=e.verification,
            signature=e.signature,
            txRef=e.tx_ref,
            notes=e.notes,
            parentId=e.parent_id
        )
