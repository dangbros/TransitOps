from fastapi import FastAPI
from app.db.database import create_db_and_tables
from app.routers.auth_router import router as auth_router
from app.routers.vehicles import router as vehicles_router
from app.routers.drivers import router as drivers_router
from app.routers.trips import router as trips_router
from app.routers.maintenance import router as maintenance_router
from app.db.seed import seed

app = FastAPI(title="TransitOps API")


@app.on_event("startup")
def on_startup():
    seed()


app.include_router(auth_router)
app.include_router(vehicles_router)
app.include_router(drivers_router)
app.include_router(trips_router)
app.include_router(maintenance_router)


@app.get("/")
def root():
    return {"message": "TransitOps API is running"}
