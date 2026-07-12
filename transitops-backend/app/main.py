from fastapi import FastAPI
from app.db.database import create_db_and_tables
from app.routers.auth_router import router as auth_router
from app.routers.vehicles import router as vehicles_router

app = FastAPI(title="TransitOps API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth_router)
app.include_router(vehicles_router)

@app.get("/")
def root():
    return {"message": "TransitOps API is running"}