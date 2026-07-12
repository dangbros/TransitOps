from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.deps import get_current_user

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

# Temporary user (will be replaced with database later)
fake_user = {
    "id": 1,
    "email": "admin@test.com",
    "password": hash_password("admin123"),
    "role": "Fleet Manager",
}


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
):

    if form_data.username != fake_user["email"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not verify_password(
        form_data.password,
        fake_user["password"],
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(
        {
            "sub": str(fake_user["id"]),
            "email": fake_user["email"],
            "role": fake_user["role"],
        }
    )

    return TokenResponse(
        access_token=access_token,
    )


@router.get("/me")
def get_me(
    current_user=Depends(get_current_user),
):
    return {
        "message": "Authenticated successfully",
        "user": current_user,
    }
