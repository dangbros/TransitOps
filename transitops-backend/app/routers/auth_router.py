from fastapi import APIRouter, HTTPException

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
def login(credentials: LoginRequest):

    if credentials.email != fake_user["email"]:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    if not verify_password(
        credentials.password,
        fake_user["password"],
    ):
        raise HTTPException(
            status_code=401,
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
