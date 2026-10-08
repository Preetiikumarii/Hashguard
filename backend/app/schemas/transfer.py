from pydantic import BaseModel
from typing import Optional, List

class TransferCreate(BaseModel):
    evidenceId: str
    evidenceTitle: str
    evidenceType: str
    fromOrg: str
    fromActor: str
    toOrg: str
    toActor: str
    manifestHash: str
    notes: Optional[str] = None
    txHash: Optional[str] = None

class TransferStep(BaseModel):
    step: str
    org: str
    timestamp: Optional[str]
    status: str

class TransferResponse(BaseModel):
    id: str
    evidenceId: str
    evidenceTitle: str
    evidenceType: str
    fromOrg: str
    fromActor: str
    toOrg: str
    toActor: str
    status: str
    transferProtocol: str
    manifestHash: str
    initiatedAt: str
    completedAt: Optional[str]
    blockchainTx: Optional[str]
    steps: List[TransferStep]
    notes: Optional[str]
