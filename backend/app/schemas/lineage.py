from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class DeriveArtifactRequest(BaseModel):
    title: str
    type: str
    hash: str
    creator: str
    filename: str
    size: str

class LineageNodeDataDetails(BaseModel):
    file: str
    size: str
    algorithm: str
    signature: str

class LineageNodeData(BaseModel):
    id: str
    label: str
    artifactType: str
    hash: str
    creator: str
    timestamp: str
    verificationState: str
    isRoot: bool
    details: LineageNodeDataDetails

class LineageNodePosition(BaseModel):
    x: float
    y: float

class LineageNode(BaseModel):
    id: str
    type: str
    position: LineageNodePosition
    data: LineageNodeData

class LineageEdgeStyle(BaseModel):
    stroke: str
    strokeWidth: int

class LineageEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str
    animated: bool
    style: LineageEdgeStyle

class LineageGraphResponse(BaseModel):
    evidenceId: str
    nodes: List[LineageNode]
    edges: List[LineageEdge]

class LineageCheck(BaseModel):
    name: str
    status: str
    details: str

class LineageVerificationResponse(BaseModel):
    evidenceId: str
    overallStatus: str
    checks: List[LineageCheck]
    verifiedAt: str
    auditorId: str
