from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str
    
class TokenPayload(BaseModel):
    sub: str | None = None
    role: str | None = None
    org_id: str | None = None

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    organization_id: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
