from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import Optional, List

from app.db.database import get_session
from app.models import Expense, Vehicle, Trip
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse
from app.core.deps import get_current_user, require_roles

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.post("", response_model=ExpenseResponse)
def create_expense(
    payload: ExpenseCreate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager", "Financial Analyst")),
):
    # Verify vehicle exists
    vehicle = session.get(Vehicle, payload.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # Verify trip exists if provided
    if payload.trip_id:
        trip = session.get(Trip, payload.trip_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

    expense = Expense(**payload.model_dump())
    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


@router.get("", response_model=List[ExpenseResponse])
def list_expenses(
    vehicle_id: Optional[int] = None,
    trip_id: Optional[int] = None,
    category: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    query = select(Expense)
    if vehicle_id:
        query = query.where(Expense.vehicle_id == vehicle_id)
    if trip_id:
        query = query.where(Expense.trip_id == trip_id)
    if category:
        query = query.where(Expense.category == category)

    expenses = session.exec(query).all()
    return expenses


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user),
):
    expense = session.get(Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense record not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager", "Financial Analyst")),
):
    expense = session.get(Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense record not found")

    # Verify vehicle if updated
    if payload.vehicle_id is not None:
        vehicle = session.get(Vehicle, payload.vehicle_id)
        if not vehicle:
            raise HTTPException(status_code=404, detail="Vehicle not found")

    # Verify trip if updated
    if payload.trip_id is not None:
        trip = session.get(Trip, payload.trip_id)
        if not trip:
            raise HTTPException(status_code=404, detail="Trip not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(expense, key, value)

    session.add(expense)
    session.commit()
    session.refresh(expense)
    return expense


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    session: Session = Depends(get_session),
    current_user: dict = Depends(require_roles("Fleet Manager")),
):
    expense = session.get(Expense, expense_id)
    if not expense:
        raise HTTPException(status_code=404, detail="Expense record not found")

    session.delete(expense)
    session.commit()
    return {"message": "Expense record deleted"}
