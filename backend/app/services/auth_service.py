from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.student import Student
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.schemas.auth import Token, LoginRequest, StudentLoginRequest


class AuthService:
    """Service for authentication operations."""
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """Authenticate a user with email and password."""
        user = db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        return user
    
    @staticmethod
    def authenticate_student(db: Session, username: str, parent_email: str) -> tuple[Student, User]:
        """Authenticate a student with username and parent email."""
        parent = db.query(User).filter(User.email == parent_email).first()
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        student = db.query(Student).filter(
            Student.username == username,
            Student.parent_id == parent.id
        ).first()
        
        if not student:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        return student, parent
    
    @staticmethod
    def create_user_tokens(user: User) -> Token:
        """Create access and refresh tokens for a user."""
        access_token = create_access_token(
            data={"sub": user.id, "role": user.role.value}
        )
        refresh_token = create_refresh_token(
            data={"sub": user.id, "role": user.role.value}
        )
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    
    @staticmethod
    def create_student_tokens(student: Student) -> Token:
        """Create access and refresh tokens for a student."""
        access_token = create_access_token(
            data={"sub": student.parent_id, "student_id": student.id, "role": "student"}
        )
        refresh_token = create_refresh_token(
            data={"sub": student.parent_id, "student_id": student.id, "role": "student"}
        )
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    
    @staticmethod
    def register_user(db: Session, email: str, password: str, full_name: str, role: str) -> User:
        """Register a new user."""
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            role=role,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
