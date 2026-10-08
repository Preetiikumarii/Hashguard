import sys
import os
from datetime import datetime, timedelta

# Add backend directory to path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import SessionLocal
from app.models.audit_log import AuditLog
import uuid

def seed():
    db = SessionLocal()
    
    # Check if there are already logs
    if db.query(AuditLog).count() > 0:
        print("Audit logs already exist. Skipping seed.")
        db.close()
        return

    print("Seeding audit logs...")
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
            details="User session authenticated via ECDSA keypair and DID identity."
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
            details="Cryptographic hash of evidence binary sealed on HashGuard smart contract (0x3592...7052)."
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
    print("Seeded realistic on-chain audit logs successfully!")
    db.close()

if __name__ == "__main__":
    seed()
