from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import create_db_and_tables
from app.routers.auth_router import router as auth_router
from app.routers.vehicles import router as vehicles_router
from app.routers.drivers import router as drivers_router
from app.routers.trips import router as trips_router
from app.routers.maintenance import router as maintenance_router
from app.routers.expenses import router as expenses_router
from app.routers.dashboard import router as dashboard_router
from app.routers import fuel
from app.db.seed import seed

app = FastAPI(title="TransitOps API")

# Allow requests from React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    seed()


app.include_router(auth_router)
app.include_router(vehicles_router)
app.include_router(drivers_router)
app.include_router(trips_router)
app.include_router(maintenance_router)
app.include_router(expenses_router)
app.include_router(dashboard_router)
app.include_router(fuel.router)


@app.get("/")
def root():
    return {"message": "TransitOps API is running"}
