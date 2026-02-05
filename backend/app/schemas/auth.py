from pydantic import BaseModel, EmailStr
from app.models.user import UserRole


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    role: UserRole
    student_id: int | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class StudentLoginRequest(BaseModel):
    username: str
    parent_email: EmailStr


class RefreshTokenRequest(BaseModel):
    refresh_token: str
