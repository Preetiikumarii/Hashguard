from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.core.config import settings
from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import TokenPayload
from app.core.exceptions import CEEException

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.ALGORITHM])
        token_data = TokenPayload(**payload)
    except JWTError:
        raise CEEException("INVALID_TOKEN", "Could not validate credentials", 401)
        
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise CEEException("USER_NOT_FOUND", "User not found", 404)
        
    return user

def require_role(allowed_roles: list[str]):
    def role_dependency(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise CEEException("FORBIDDEN", "Not enough permissions", 403)
        return current_user
    return role_dependency
