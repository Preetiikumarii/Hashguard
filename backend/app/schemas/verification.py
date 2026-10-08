from pydantic import BaseModel
from typing import List, Optional

class VerificationRequest(BaseModel):
    identifier: str

class VerificationCheck(BaseModel):
    key: str
    title: str
    status: str
    expected: str
    actual: str
    description: str

class VerificationResponse(BaseModel):
    identifier: str
    overallStatus: str
    tamperDetected: bool
    verifiedAt: str
    auditorId: str
    onChainBlock: Optional[int]
    checks: List[VerificationCheck]
