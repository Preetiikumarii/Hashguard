from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EvidenceCreate(BaseModel):
    id: Optional[str] = None
    caseId: Optional[str] = "CASE-2026-9012"
    title: str
    type: Optional[str] = "Malware Binary"
    sourceOrg: Optional[str] = "Organization A (CERT-Alpha)"
    currentCustodian: Optional[str] = "Organization A (CERT-Alpha)"
    hash: str
    fileSize: Optional[str] = "1.0 MB"
    collector: Optional[str] = "analyst-lead@org-a.gov"
    parentEvidenceId: Optional[str] = None
    description: Optional[str] = "Newly collected forensic artifact registered to custody ledger."
    forensicNotes: Optional[str] = None
    txHash: Optional[str] = None

class SignatureSchema(BaseModel):
    status: str
    signer: str
    algorithm: str
    publicKeyFingerprint: str
    signedTimestamp: str
    manifestId: str

class EvidenceResponse(BaseModel):
    id: str
    caseId: Optional[str] = "CASE-2026-9012"
    title: str
    type: str
    sourceOrg: str
    currentCustodian: str
    hash: str
    expectedHash: str
    hashAlgorithm: str
    status: str
    fileSize: Optional[str]
    collector: Optional[str]
    createdAt: str
    lastEvent: str
    lastEventTime: str
    storageType: str
    storageLocation: Optional[str]
    accessControl: str
    blockchainStatus: str
    blockNumber: Optional[int]
    txHash: Optional[str]
    signature: SignatureSchema
    parentEvidenceId: Optional[str]
    isDerived: bool
    derivedCount: int
    description: Optional[str]
    forensicNotes: Optional[str] = None
    retentionPolicyId: Optional[str] = None
    retentionPolicyName: Optional[str] = None
    retentionStatus: Optional[str] = "ACTIVE"
    retentionExpiresAt: Optional[str] = None
    legalHold: Optional[bool] = False
    legalHoldReason: Optional[str] = None

