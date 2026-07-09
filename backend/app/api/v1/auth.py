from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import Token, LoginRequest, StudentLoginRequest
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService
from app.models.user import UserRole

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new parent user."""
    user = AuthService.register_user(
        db=db,
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name,
        role=UserRole.PARENT
    )
    return user


@router.post("/login", response_model=Token)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password."""
    user = AuthService.authenticate_user(db, login_data.email, login_data.password)
    return AuthService.create_user_tokens(user)


@router.post("/student-login", response_model=Token)
def student_login(login_data: StudentLoginRequest, db: Session = Depends(get_db)):
    """Student login with username and parent email."""
    student, parent = AuthService.authenticate_student(
        db, login_data.username, login_data.parent_email
    )
    return AuthService.create_student_tokens(student)


@router.post("/refresh", response_model=Token)
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    """Refresh access token using refresh token."""
    from app.core.security import decode_token, create_access_token
    
    payload = decode_token(refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid token type")
    
    user_id = payload.get("sub")
    role = payload.get("role")
    student_id = payload.get("student_id")
    
    token_data = {"sub": user_id, "role": role}
    if student_id:
        token_data["student_id"] = student_id
    
    access_token = create_access_token(data=token_data)
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer"
    )
