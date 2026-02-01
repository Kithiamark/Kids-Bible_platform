from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import (
    verify_password,
    create_access_token,
)
from app.services.user_service import get_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = get_user(form_data.username)
    if not user or not verify_password(
        form_data.password, user["hashed_password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token(
        data={"sub": user["email"], "role": user["role"]}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
    }
