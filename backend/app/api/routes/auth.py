from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database.database import get_db
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse
from app.models.user import User
from app.core.security import verify_password, create_access_token
from app.core.config import settings
from app.core.exceptions import CEEException

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise CEEException(code="INVALID_CREDENTIALS", message="Incorrect email or password", status_code=401)
    
    if user.status != "ACTIVE":
        raise CEEException(code="ACCOUNT_DISABLED", message="Account disabled", status_code=403)
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        subject=user.id,
        role=user.role,
        organization_id=user.organization_id,
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            role=user.role,
            organization_id=user.organization_id
        )
    )
