from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.db.database import create_db_and_tables
from app.routers.auth_router import router as auth_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs when the application starts
    create_db_and_tables()
    yield
    # Runs when the application shuts down
    # (Nothing to clean up yet)


app = FastAPI(lifespan=lifespan)
app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "TransitOps Backend Running"}
