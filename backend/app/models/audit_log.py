from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.database.database import Base
import uuid

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=lambda: f"LOG-{str(uuid.uuid4().int)[:5]}")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    event = Column(String, nullable=False)
    actor = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    evidence_id = Column(String, nullable=True)
    event_id = Column(String, nullable=True)
    verification = Column(String, nullable=True)
    reference = Column(String, nullable=True)
    details = Column(String, nullable=True)
