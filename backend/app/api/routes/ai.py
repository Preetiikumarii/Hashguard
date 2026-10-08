from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import os
import json
import google.generativeai as genai
from typing import List
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.services.evidence_service import EvidenceService

router = APIRouter()

class AITriageRequest(BaseModel):
    evidence_id: str
    title: str
    type: str

class AITriageResponse(BaseModel):
    threatLevel: str
    confidence: str
    summary: str
    iocs: List[str]
    recommendation: str

@router.post("/triage", response_model=AITriageResponse)
def run_ai_triage(request: AITriageRequest, db: Session = Depends(get_db)):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured on server.")

    evidence = EvidenceService.get_by_id(db, request.evidence_id)
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence not found.")

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-3.6-flash', generation_config={"response_mime_type": "application/json"})
        
        forensic_notes = evidence.forensicNotes if evidence.forensicNotes else "No raw notes or sample data provided."

        prompt = f"""
        You are an elite Cyber Threat Intelligence AI. 
        Analyze the following piece of forensic evidence collected by an investigator.
        
        Evidence ID: {evidence.id}
        Evidence Type: {evidence.type}
        Title/Description: {evidence.title}
        File Hash: {evidence.hash}
        
        RAW SAMPLE / FORENSIC NOTES:
        '''
        {forensic_notes}
        '''
        
        Provide a highly professional, forensic threat triage report based on the provided metadata and raw sample. 
        Determine a plausible threat level (LOW, MEDIUM, HIGH, CRITICAL).
        Extract actual Indicators of Compromise (IoCs) from the raw sample if present (IPs, hashes, domains, suspicious commands).
        If the raw sample is empty or generic, infer plausible behavior based on the title/type.
        Keep it brief and punchy.
        
        Respond ONLY with a valid JSON object matching this schema:
        {{
            "threatLevel": "CRITICAL",
            "confidence": "95%",
            "summary": "1-2 sentence executive summary of the threat.",
            "iocs": ["IoC 1", "IoC 2", "IoC 3"],
            "recommendation": "1 sentence recommended action."
        }}
        """
        
        response = model.generate_content(prompt)
        result = json.loads(response.text)
        
        return AITriageResponse(
            threatLevel=result.get("threatLevel", "UNKNOWN"),
            confidence=result.get("confidence", "N/A"),
            summary=result.get("summary", "Analysis failed to produce a summary."),
            iocs=result.get("iocs", []),
            recommendation=result.get("recommendation", "Review manually.")
        )
        
    except Exception as e:
        print(f"AI Triage Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
