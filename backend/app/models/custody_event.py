from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.sql import func
from app.database.database import Base
import uuid

class CustodyEvent(Base):
    __tablename__ = "custody_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = Column(String, unique=True, index=True, nullable=False)
    evidence_id = Column(String, ForeignKey("evidence.id"), nullable=False)
    event = Column(String, nullable=False)
    actor = Column(String, nullable=False)
    organization = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    hash = Column(String, nullable=False)
    verification = Column(String, default="VERIFIED")
    signature = Column(String, nullable=False)
    tx_ref = Column(String, nullable=True)
    notes = Column(String, nullable=True)
    parent_id = Column(String, nullable=True)
    
    # Internal sequential tracking
    sequence_number = Column(Integer, autoincrement=True)
