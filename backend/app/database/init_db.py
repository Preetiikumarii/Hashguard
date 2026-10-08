from app.database.database import SessionLocal
from app.models.organization import Organization
from app.models.user import User
from app.models.audit_log import AuditLog
from app.core.security import get_password_hash
from datetime import datetime, timedelta
import uuid

def init_db():
    db = SessionLocal()
    try:
        # Seed Organizations
        org_a = db.query(Organization).filter(Organization.id == "ORG-A").first()
        if not org_a:
            org_a = Organization(
                id="ORG-A",
                organization_code="ORG-A",
                name="Organization A — CERT-Alpha",
                description="Evidence originator and national response node",
                status="ACTIVE"
            )
            db.add(org_a)

        org_b = db.query(Organization).filter(Organization.id == "ORG-B").first()
        if not org_b:
            org_b = Organization(
                id="ORG-B",
                organization_code="ORG-B",
                name="Organization B — Cyber Defense Lab",
                description="Forensic analysis laboratory node",
                status="ACTIVE"
            )
            db.add(org_b)

        org_c = db.query(Organization).filter(Organization.id == "ORG-C").first()
        if not org_c:
            org_c = Organization(
                id="ORG-C",
                organization_code="ORG-C",
                name="Organization C — Judicial Court Registry",
                description="Legal prosecution and court evidence vault node",
                status="ACTIVE"
            )
            db.add(org_c)

        org_d = db.query(Organization).filter(Organization.id == "ORG-D").first()
        if not org_d:
            org_d = Organization(
                id="ORG-D",
                organization_code="ORG-D",
                name="Organization D — Cyber Crime Police (LEA)",
                description="Law enforcement agency and raid seizure node",
                status="ACTIVE"
            )
            db.add(org_d)

        org_audit = db.query(Organization).filter(Organization.id == "ORG-AUDIT").first()
        if not org_audit:
            org_audit = Organization(
                id="ORG-AUDIT",
                organization_code="ORG-AUDIT",
                name="Audit Board — Independent Oversight",
                description="Independent cryptographic auditing and oversight authority",
                status="ACTIVE"
            )
            db.add(org_audit)
        db.commit()

        # Seed Retention Policies if empty
        from app.models.retention import RetentionPolicy
        if db.query(RetentionPolicy).count() == 0:
            default_policies = [
                RetentionPolicy(
                    id="POL-001",
                    name="Active Investigation Evidence",
                    retention_period_days=365,
                    trigger_event="evidence_sealed",
                    action_on_expiry="ARCHIVE_COLD",
                    allow_legal_hold=True,
                    is_active=True,
                    created_by="System Administrator"
                ),
                RetentionPolicy(
                    id="POL-002",
                    name="Closed Case Evidence",
                    retention_period_days=180,
                    trigger_event="case_closed",
                    action_on_expiry="ARCHIVE_COLD",
                    allow_legal_hold=True,
                    is_active=True,
                    created_by="System Administrator"
                ),
                RetentionPolicy(
                    id="POL-003",
                    name="Forensic / Malware Evidence",
                    retention_period_days=1825,
                    trigger_event="evidence_sealed",
                    action_on_expiry="LONG_TERM_ARCHIVE",
                    allow_legal_hold=True,
                    is_active=True,
                    created_by="System Administrator"
                ),
                RetentionPolicy(
                    id="POL-004",
                    name="Temporary / Unverified Evidence",
                    retention_period_days=30,
                    trigger_event="evidence_uploaded",
                    action_on_expiry="MARK_FOR_REVIEW",
                    allow_legal_hold=False,
                    is_active=True,
                    created_by="System Administrator"
                )
            ]
            for p in default_policies:
                db.add(p)
            db.commit()

        # Seed Admin User
        user = db.query(User).filter(User.email == "admin@cyberlab.local").first()
        if not user:
            user = User(
                id="USR-001",
                email="admin@cyberlab.local",
                password_hash=get_password_hash("admin123"),
                organization_id="ORG-B",
                role="ADMIN",
                status="ACTIVE"
            )
            db.add(user)

        user_a = db.query(User).filter(User.email == "admin@cert-alpha.gov").first()
        if not user_a:
            user_a = User(
                id="USR-002",
                email="admin@cert-alpha.gov",
                password_hash=get_password_hash("admin123"),
                organization_id="ORG-A",
                role="ADMIN",
                status="ACTIVE"
            )
            db.add(user_a)
        db.commit()

        # Seed initial Evidence exhibits if empty
        from app.models.evidence import Evidence
        if db.query(Evidence).count() == 0:
            sample_ev = Evidence(
                id="EV-C17CE47C",
                title="LockBit 3.0 Ransomware Payload",
                type="Malware Binary",
                source_org="Organization A — CERT-Alpha",
                current_custodian="Organization A — CERT-Alpha",
                hash="8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
                expected_hash="8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
                file_size="0.64 KB",
                collector="analyst-1@cert-alpha.gov",
                description="Forensic bitstream dump of LockBit 3.0 Black variant recovered from compromised hypervisor.",
                forensic_notes="PE binary unpack reveals shadow copy deletion routines and C2 callback URLs.",
                storage_location="vault://secure-enclave/EV-C17CE47C.raw",
                tx_hash="0x8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
                block_number=482780,
                blockchain_status="CONFIRMED",
                status="VERIFIED"
            )
            db.add(sample_ev)
            db.commit()

        # Seed initial audit logs if empty
        if db.query(AuditLog).count() == 0:
            now = datetime.utcnow()
            logs = [
                AuditLog(
                    id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
                    timestamp=now - timedelta(hours=24),
                    event="USER_LOGIN",
                    actor="admin@cert-alpha.gov",
                    organization="CERT-Alpha",
                    evidence_id="N/A",
                    event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
                    verification="SUCCESS",
                    reference="did:ethr:0xa77ed19aca6f082e1c93a0271b83d10291e0182f",
                    details="User authenticated via Web3 ECDSA keypair and decentralized identifier (DID)."
                ),
                AuditLog(
                    id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
                    timestamp=now - timedelta(hours=23),
                    event="EVIDENCE_SEALED",
                    actor="analyst-1@cert-alpha.gov",
                    organization="CERT-Alpha",
                    evidence_id="EV-C17CE47C",
                    event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
                    verification="VERIFIED",
                    reference="0x8f3a91bc72f4cd2a4e9b671a5c28e930f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
                    details="Cryptographic SHA-256 manifest anchored on-chain to HashGuard smart contract (0x3592...7052)."
                ),
                AuditLog(
                    id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
                    timestamp=now - timedelta(hours=22),
                    event="AI_TRIAGE_RUN",
                    actor="system@ai-engine",
                    organization="CERT-Alpha",
                    evidence_id="EV-C17CE47C",
                    event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
                    verification="VERIFIED",
                    reference="0x8eb2d91c7a1024e03bc184a839f9024c6198f12a3d0a3db8cec29910bac32d2",
                    details="Automated LLM forensic classification attested on-chain via oracle proof digest."
                ),
                AuditLog(
                    id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
                    timestamp=now - timedelta(hours=1),
                    event="CROSS_ORG_TRANSFER",
                    actor="ops-transport@cert-alpha.gov",
                    organization="CERT-Alpha",
                    evidence_id="EV-C17CE47C",
                    event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
                    verification="PENDING",
                    reference="0x885aa76a3921b74e6f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e",
                    details="Smart contract escrow lock initiated. Transfer payload dispatched to Organization B (Cyber Defense Lab)."
                ),
                AuditLog(
                    id=f"AUD-{str(uuid.uuid4())[:8].upper()}",
                    timestamp=now - timedelta(minutes=45),
                    event="EVIDENCE_SEALED",
                    actor="analyst@cyberlab.local",
                    organization="Cyber Defense Lab",
                    evidence_id="EV-001",
                    event_id=f"EVT-{str(uuid.uuid4())[:8].upper()}",
                    verification="VERIFIED",
                    reference="0x3592925cf64e7c3c68d4911b2ebc722c2ea67052",
                    details="Forensic memory dump exhibit sealed into custody enclave with client-side SHA-256 verification."
                )
            ]
            for log in logs:
                db.add(log)
            db.commit()
            print("[Database] Initial audit logs and seed data successfully initialized.")

    except Exception as e:
        db.rollback()
        print(f"[Database] Error during initial database seeding: {e}")
    finally:
        db.close()
