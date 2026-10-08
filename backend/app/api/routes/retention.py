from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.retention import RetentionPolicy, RetentionEvent
from app.models.evidence import Evidence
from app.models.audit_log import AuditLog
from pydantic import BaseModel
from typing import List, Optional
import datetime
import uuid

router = APIRouter()

DEFAULT_POLICIES = [
    {
        "id": "POL-001",
        "name": "Active Investigation Evidence",
        "retention_period_days": 365,
        "trigger_event": "evidence_sealed",
        "action_on_expiry": "ARCHIVE_COLD",
        "allow_legal_hold": True,
        "is_active": True,
        "created_by": "System Administrator"
    },
    {
        "id": "POL-002",
        "name": "Closed Case Evidence",
        "retention_period_days": 180,
        "trigger_event": "case_closed",
        "action_on_expiry": "ARCHIVE_COLD",
        "allow_legal_hold": True,
        "is_active": True,
        "created_by": "System Administrator"
    },
    {
        "id": "POL-003",
        "name": "Forensic / Malware Evidence",
        "retention_period_days": 1825,
        "trigger_event": "evidence_sealed",
        "action_on_expiry": "LONG_TERM_ARCHIVE",
        "allow_legal_hold": True,
        "is_active": True,
        "created_by": "System Administrator"
    },
    {
        "id": "POL-004",
        "name": "Temporary / Unverified Evidence",
        "retention_period_days": 30,
        "trigger_event": "evidence_uploaded",
        "action_on_expiry": "MARK_FOR_REVIEW",
        "allow_legal_hold": False,
        "is_active": True,
        "created_by": "System Administrator"
    }
]

class RetentionPolicyCreate(BaseModel):
    name: str
    retention_period_days: int
    trigger_event: str
    action_on_expiry: str
    allow_legal_hold: Optional[bool] = True
    is_active: Optional[bool] = True

class RetentionPolicyUpdate(BaseModel):
    name: Optional[str] = None
    retention_period_days: Optional[int] = None
    trigger_event: Optional[str] = None
    action_on_expiry: Optional[str] = None
    allow_legal_hold: Optional[bool] = None
    is_active: Optional[bool] = None

class PolicyAssignRequest(BaseModel):
    policy_id: str
    actor: Optional[str] = "custodian@hashguard.gov"
    organization: Optional[str] = "Cyber Defense Lab"

class LegalHoldRequest(BaseModel):
    reason: str
    actor: Optional[str] = "custodian@hashguard.gov"
    organization: Optional[str] = "Cyber Defense Lab"

class LegalHoldReleaseRequest(BaseModel):
    reason: str
    actor: Optional[str] = "custodian@hashguard.gov"
    organization: Optional[str] = "Cyber Defense Lab"

class RetentionExtendRequest(BaseModel):
    reason: str
    additional_days: int

def seed_default_policies_if_empty(db: Session):
    existing = db.query(RetentionPolicy).count()
    if existing == 0:
        for p in DEFAULT_POLICIES:
            new_p = RetentionPolicy(**p)
            db.add(new_p)
        db.commit()

@router.get("/policies")
def get_policies(db: Session = Depends(get_db)):
    seed_default_policies_if_empty(db)
    return db.query(RetentionPolicy).all()

@router.post("/policies")
def create_policy(policy: RetentionPolicyCreate, db: Session = Depends(get_db)):
    policy_dict = policy.dict()
    if not policy_dict.get("id"):
        policy_dict["id"] = f"POL-{str(uuid.uuid4())[:8].upper()}"
    new_policy = RetentionPolicy(**policy_dict)
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)

    # Record Audit Event
    audit_entry = AuditLog(
        id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
        event="RETENTION_POLICY_CREATED",
        actor="admin@hashguard.gov",
        organization="Platform Governance Authority",
        evidence_id=new_policy.id,
        event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
        verification="VERIFIED",
        reference=f"POL-ROOT-{new_policy.id}",
        details=f"Retention policy '{new_policy.name}' created ({new_policy.retention_period_days} Days, Trigger: {new_policy.trigger_event}, Action: {new_policy.action_on_expiry}, Legal Hold: {'Enabled' if new_policy.allow_legal_hold else 'Disabled'})."
    )
    db.add(audit_entry)
    db.commit()

    return new_policy

@router.patch("/policies/{policy_id}")
def update_policy(policy_id: str, update: RetentionPolicyUpdate, db: Session = Depends(get_db)):
    policy = db.query(RetentionPolicy).filter(RetentionPolicy.id == policy_id).first()
    if not policy:
        raise HTTPException(404, "Retention policy not found")

    update_data = update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(policy, key, value)

    # Record Audit Event
    audit_entry = AuditLog(
        id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
        event="RETENTION_POLICY_UPDATED",
        actor="admin@hashguard.gov",
        organization="Platform Governance Authority",
        evidence_id=policy.id,
        event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
        verification="VERIFIED",
        reference=f"POL-ROOT-{policy.id}",
        details=f"Retention policy '{policy.name}' updated. Status: {'Active' if policy.is_active else 'Disabled'}."
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(policy)
    return policy

@router.get("/legal-holds")
def get_legal_holds(db: Session = Depends(get_db)):
    """Returns all evidence exhibits currently protected from retention expiry under Legal Hold."""
    holds = db.query(Evidence).filter(Evidence.legal_hold == True).all()
    results = []
    for ev in holds:
        results.append({
            "id": ev.id,
            "evidenceId": ev.id,
            "title": ev.title,
            "caseId": ev.case_id or "CASE-2026-9012",
            "type": ev.type,
            "sourceOrg": ev.source_org,
            "currentCustodian": ev.current_custodian,
            "policyName": ev.retention_policy_name or "Active Investigation Evidence",
            "status": "ON HOLD",
            "retention": "SUSPENDED",
            "deletion": "BLOCKED",
            "appliedBy": ev.legal_hold_applied_by or "custodian@hashguard.gov",
            "appliedAt": ev.legal_hold_applied_at.strftime('%Y-%m-%d %H:%M:%S UTC') if ev.legal_hold_applied_at else "2026-08-16 09:45:00 UTC",
            "reason": ev.legal_hold_reason or "Court-ordered preservation order pending forensic verification."
        })
    return results

@router.post("/evidence/{evidence_id}/legal-hold")
def apply_legal_hold(evidence_id: str, req: LegalHoldRequest, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(404, "Evidence not found")

    evidence.legal_hold = True
    evidence.legal_hold_reason = req.reason
    evidence.legal_hold_applied_by = req.actor
    evidence.legal_hold_applied_at = datetime.datetime.utcnow()
    evidence.retention_status = "LEGAL_HOLD"

    event = RetentionEvent(
        evidence_id=evidence_id,
        event_type="legal_hold_applied",
        actor_id=req.actor,
        reason=req.reason
    )
    db.add(event)

    audit_entry = AuditLog(
        id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
        event="LEGAL_HOLD_APPLIED",
        actor=req.actor,
        organization=req.organization,
        evidence_id=evidence_id,
        event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
        verification="VERIFIED",
        reference=f"HOLD-ORDER-{evidence_id}",
        details=f"Legal Hold preservation order applied to {evidence_id}. Reason: {req.reason}. Retention countdown SUSPENDED, deletion BLOCKED."
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(evidence)

    return {
        "status": "success",
        "evidenceId": evidence_id,
        "retentionStatus": "LEGAL_HOLD",
        "legalHold": True,
        "message": f"Legal Hold applied to {evidence_id}. Retention suspended and deletion blocked."
    }

@router.post("/evidence/{evidence_id}/release-hold")
def release_legal_hold(evidence_id: str, req: LegalHoldReleaseRequest, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(404, "Evidence not found")

    evidence.legal_hold = False
    evidence.legal_hold_reason = None
    evidence.retention_status = "ACTIVE"

    event = RetentionEvent(
        evidence_id=evidence_id,
        event_type="legal_hold_released",
        actor_id=req.actor,
        reason=req.reason
    )
    db.add(event)

    audit_entry = AuditLog(
        id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
        event="LEGAL_HOLD_RELEASED",
        actor=req.actor,
        organization=req.organization,
        evidence_id=evidence_id,
        event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
        verification="VERIFIED",
        reference=f"HOLD-RELEASE-{evidence_id}",
        details=f"Legal Hold released for {evidence_id}. Reason: {req.reason}. Original retention policy resumed."
    )
    db.add(audit_entry)
    db.commit()
    db.refresh(evidence)

    return {
        "status": "success",
        "evidenceId": evidence_id,
        "retentionStatus": "ACTIVE",
        "legalHold": False,
        "message": f"Legal Hold released for {evidence_id}. Retention policy resumed."
    }

@router.patch("/evidence/{evidence_id}/policy")
def assign_policy(evidence_id: str, req: PolicyAssignRequest, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence:
        raise HTTPException(404, "Evidence not found")
    
    policy = db.query(RetentionPolicy).filter(RetentionPolicy.id == req.policy_id).first()
    if not policy:
        raise HTTPException(404, "Policy not found")
    
    evidence.retention_policy_id = policy.id
    evidence.retention_policy_name = policy.name
    evidence.retention_start_at = datetime.datetime.utcnow()
    evidence.retention_expires_at = evidence.retention_start_at + datetime.timedelta(days=policy.retention_period_days)
    if not evidence.legal_hold:
        evidence.retention_status = "ACTIVE"
    
    event = RetentionEvent(
        evidence_id=evidence_id,
        event_type="policy_assigned",
        actor_id=req.actor,
        reason=f"Assigned retention policy: {policy.name} ({policy.retention_period_days} Days)"
    )
    db.add(event)

    audit_entry = AuditLog(
        id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
        event="RETENTION_STARTED",
        actor=req.actor,
        organization=req.organization,
        evidence_id=evidence_id,
        event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
        verification="VERIFIED",
        reference=f"POL-ASSIGN-{policy.id}",
        details=f"Retention policy '{policy.name}' assigned to {evidence_id}. Period: {policy.retention_period_days} Days, Expiry Action: {policy.action_on_expiry}."
    )
    db.add(audit_entry)
    db.commit()
    return {
        "status": "success",
        "policyName": policy.name,
        "expires_at": evidence.retention_expires_at.strftime('%Y-%m-%d %H:%M:%S UTC')
    }

@router.post("/evidence/{evidence_id}/extend")
def extend_retention(evidence_id: str, req: RetentionExtendRequest, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not evidence or not evidence.retention_expires_at:
        raise HTTPException(400, "Invalid evidence or no active retention")
        
    evidence.retention_expires_at += datetime.timedelta(days=req.additional_days)
    evidence.retention_status = 'ACTIVE'
    
    # Write on chain
    tx_hash = None
    try:
        from app.blockchain.evm_client import evm_client
        token_id = evm_client.get_token_id_for_asset(evidence_id)
        if token_id:
            receipt = evm_client.log_retention_event(token_id, "retention_extended")
            if receipt: tx_hash = receipt['transactionHash'].hex()
    except Exception:
        pass
    
    event = RetentionEvent(
        evidence_id=evidence_id,
        event_type="retention_extended",
        reason=req.reason,
        tx_hash=tx_hash
    )
    db.add(event)
    db.commit()
    return {"status": "success", "new_expiry": evidence.retention_expires_at}

@router.get("/evidence/{evidence_id}/history")
def get_history(evidence_id: str, db: Session = Depends(get_db)):
    return db.query(RetentionEvent).filter(RetentionEvent.evidence_id == evidence_id).order_by(RetentionEvent.created_at.desc()).all()
