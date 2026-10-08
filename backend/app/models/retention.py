from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Enum, Boolean
from sqlalchemy.orm import relationship
import uuid
import datetime
from app.database.database import Base

class RetentionPolicy(Base):
    __tablename__ = "retention_policies"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    retention_period_days = Column(Integer, nullable=False)
    trigger_event = Column(String, nullable=False) # e.g. 'case_closed', 'evidence_sealed', 'manual'
    action_on_expiry = Column(String, nullable=False) # 'archive' or 'delete'
    allow_legal_hold = Column(Boolean, default=True) # Legal Hold Override enabled
    is_active = Column(Boolean, default=True) # Active or Disabled
    created_by = Column(String, nullable=True) # User ID (Admin)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RetentionEvent(Base):
    __tablename__ = "retention_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    evidence_id = Column(String, ForeignKey("evidence.id"), nullable=False)
    event_type = Column(String, nullable=False) # 'policy_assigned', 'expiry_warning_sent', 'archived', 'deleted', 'retention_extended'
    actor_id = Column(String, nullable=True)
    reason = Column(Text, nullable=True)
    tx_hash = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
