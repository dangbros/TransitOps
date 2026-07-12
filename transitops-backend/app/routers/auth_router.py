from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db.database import get_session
from app.models import User, Role
from fastapi.security import OAuth2PasswordRequestForm
from app.core.deps import get_current_user

from app.core.security import (
    create_access_token,
    verify_password,
    hash_password,
)
from app.schemas.auth import TokenResponse, UserCreate

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    user = session.exec(select(User).where(User.email == form_data.username)).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    if not verify_password(
        form_data.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    role = session.get(Role, user.role_id)
    role_name = role.name if role else ""

    access_token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": role_name,
            "role_id": user.role_id,
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


@router.post("/signup", response_model=TokenResponse)
def signup(
    payload: UserCreate,
    session: Session = Depends(get_session),
):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Map frontend role keys to database names
    role_mapping = {
        "fleet_manager": "Fleet Manager",
        "driver": "Driver",
        "safety_officer": "Safety Officer",
        "financial_analyst": "Financial Analyst",
    }
    role_name = role_mapping.get(payload.role, payload.role)

    role = session.exec(select(Role).where(Role.name == role_name)).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role '{payload.role}' does not exist",
        )

    new_user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        role_id=role.id,
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    access_token = create_access_token(
        {
            "sub": str(new_user.id),
            "email": new_user.email,
            "role": role.name,
            "role_id": new_user.role_id,
        }
    )

    return TokenResponse(
        access_token=access_token,
    )
