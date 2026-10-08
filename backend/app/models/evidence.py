from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Integer
from sqlalchemy.sql import func
from app.database.database import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True)
    case_id = Column(String, nullable=True, index=True)
    title = Column(String, nullable=False)
    type = Column(String, nullable=False)
    source_org = Column(String, nullable=False)
    current_custodian = Column(String, nullable=False)
    hash = Column(String, nullable=False)
    expected_hash = Column(String, nullable=False)
    hash_algorithm = Column(String, default="SHA-256")
    status = Column(String, default="PENDING")
    file_size = Column(String, nullable=True)
    collector = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_event = Column(String, default="COLLECT")
    last_event_time = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    storage_type = Column(String, default="OFF-CHAIN SECURED")
    storage_location = Column(String, nullable=True)
    access_control = Column(String, default="RESTRICTED / AUTHORIZED ROLES ONLY")
    blockchain_status = Column(String, default="PENDING_ON_CHAIN")
    block_number = Column(Integer, nullable=True)
    tx_hash = Column(String, nullable=True)
    
    parent_evidence_id = Column(String, ForeignKey("evidence.id"), nullable=True)
    is_derived = Column(Boolean, default=False)
    derived_count = Column(Integer, default=0)
    description = Column(String, nullable=True)
    forensic_notes = Column(String, nullable=True)

    # SIH Digital Asset Management Fields
    asset_category = Column(String, default="FORENSIC_EVIDENCE") # DOCUMENT, IMAGE, MEDIA, DATASET, SECURITY_ARTIFACT, FORENSIC_EVIDENCE
    owner = Column(String, nullable=True) # Registered Asset Owner of the asset
    owner_did = Column(String, nullable=True) # Owner's Decentralized Identifier
    access_list = Column(String, default="[]") # JSON string of allowed DIDs/Organizations

    # Retention fields
    retention_policy_id = Column(String, ForeignKey("retention_policies.id"), nullable=True)
    retention_policy_name = Column(String, nullable=True)
    retention_start_at = Column(DateTime, nullable=True)
    retention_expires_at = Column(DateTime, nullable=True)
    retention_status = Column(String, default="ACTIVE") # 'ACTIVE', 'LEGAL_HOLD', 'SUSPENDED', 'ARCHIVED', 'DELETED'
    legal_hold = Column(Boolean, default=False)
    legal_hold_reason = Column(String, nullable=True)
    legal_hold_applied_by = Column(String, nullable=True)
    legal_hold_applied_at = Column(DateTime, nullable=True)

