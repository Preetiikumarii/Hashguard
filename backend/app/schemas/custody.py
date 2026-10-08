from pydantic import BaseModel
from typing import Optional

class CustodyEventCreate(BaseModel):
    evidenceId: str
    event: str
    actor: str
    organization: str
    hash: str
    notes: Optional[str] = None
    parentId: Optional[str] = None

class CustodyEventResponse(BaseModel):
    eventId: str
    evidenceId: str
    event: str
    actor: str
    organization: str
    timestamp: str
    hash: str
    verification: str
    signature: str
    txRef: Optional[str]
    notes: Optional[str]
    parentId: Optional[str]
