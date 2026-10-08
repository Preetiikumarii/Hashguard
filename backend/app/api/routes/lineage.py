from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.lineage import DeriveArtifactRequest, LineageGraphResponse, LineageVerificationResponse
from app.services.lineage_service import LineageService

router = APIRouter()

@router.get("/{evidence_id}", response_model=LineageGraphResponse)
def get_lineage(evidence_id: str, db: Session = Depends(get_db)):
    graph = LineageService.get_graph(db, evidence_id)
    if not graph:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return graph

@router.post("/{parent_id}/derive")
def derive_artifact(parent_id: str, request: DeriveArtifactRequest, db: Session = Depends(get_db)):
    return LineageService.derive(db, parent_id, request)

@router.post("/{evidence_id}/verify", response_model=LineageVerificationResponse)
def verify_lineage(evidence_id: str, db: Session = Depends(get_db)):
    return LineageService.verify(db, evidence_id)
