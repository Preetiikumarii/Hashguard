from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.database.database import Base
import uuid

class Transfer(Base):
    __tablename__ = "transfers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    transfer_id = Column(String, unique=True, index=True, nullable=False)
    evidence_id = Column(String, ForeignKey("evidence.id"), nullable=False)
    evidence_title = Column(String, nullable=False)
    evidence_type = Column(String, nullable=False)
    from_org = Column(String, nullable=False)
    from_actor = Column(String, nullable=False)
    to_org = Column(String, nullable=False)
    to_actor = Column(String, nullable=False)
    status = Column(String, default="REQUESTED")
    transfer_protocol = Column(String, default="mTLS Encrypted Transport + Signed Manifest")
    manifest_hash = Column(String, nullable=False)
    initiated_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)
    blockchain_tx = Column(String, nullable=True)
    notes = Column(String, nullable=True)
