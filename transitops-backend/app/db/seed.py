from sqlmodel import Session, select
from datetime import date, timedelta
from app.db.database import engine, create_db_and_tables
from app.core.security import hash_password
from app.models import Role, User, Vehicle, Driver, VehicleStatus, DriverStatus


def seed():
    create_db_and_tables()

    with Session(engine) as session:
        # Skip if already seeded
        existing = session.exec(select(Role)).first()
        if existing:
            print("Database already seeded. Skipping.")
            return

        # 1. Roles
        roles = [
            Role(name="Fleet Manager"),
            Role(name="Driver"),
            Role(name="Safety Officer"),
            Role(name="Financial Analyst"),
        ]
        session.add_all(roles)
        session.commit()
        for r in roles:
            session.refresh(r)

        # 2. Users (one per role)
        users = [
            User(email="fleetmanager@transitops.com", password_hash=hash_password("password123"), role_id=roles[0].id),
            User(email="driver@transitops.com", password_hash=hash_password("password123"), role_id=roles[1].id),
            User(email="safety@transitops.com", password_hash=hash_password("password123"), role_id=roles[2].id),
            User(email="finance@transitops.com", password_hash=hash_password("password123"), role_id=roles[3].id),
        ]
        session.add_all(users)
        session.commit()

        # 3. Vehicles 
        vehicles = [
            Vehicle(registration_number="VAN-01", name_model="Ford Transit", type="Van", region="North", max_load_capacity=800, odometer=12000, acquisition_cost=25000, status=VehicleStatus.available),
            Vehicle(registration_number="VAN-02", name_model="Ford Transit", type="Van", region="South", max_load_capacity=800, odometer=8000, acquisition_cost=25000, status=VehicleStatus.available),
            Vehicle(registration_number="TRUCK-01", name_model="Volvo FH", type="Truck", region="North", max_load_capacity=5000, odometer=45000, acquisition_cost=90000, status=VehicleStatus.in_shop),
            Vehicle(registration_number="TRUCK-02", name_model="Volvo FH", type="Truck", region="East", max_load_capacity=5000, odometer=60000, acquisition_cost=90000, status=VehicleStatus.available),
            Vehicle(registration_number="TRUCK-03", name_model="Scania R", type="Truck", region="West", max_load_capacity=6000, odometer=100000, acquisition_cost=95000, status=VehicleStatus.retired),
        ]
        session.add_all(vehicles)
        session.commit()

        # 4. Drivers (include expired + suspended to test validations)
        drivers = [
            Driver(name="Alex Carter", license_number="LIC-001", license_category="B", license_expiry_date=date.today() + timedelta(days=365), contact_number="9999900001", safety_score=0.95, status=DriverStatus.available),
            Driver(name="Priya Sharma", license_number="LIC-002", license_category="C", license_expiry_date=date.today() + timedelta(days=180), contact_number="9999900002", safety_score=0.9, status=DriverStatus.available),
            Driver(name="Sam Lee", license_number="LIC-003", license_category="B", license_expiry_date=date.today() - timedelta(days=10), contact_number="9999900003", safety_score=0.8, status=DriverStatus.available),  # expired
            Driver(name="Jordan Kim", license_number="LIC-004", license_category="C", license_expiry_date=date.today() + timedelta(days=200), contact_number="9999900004", safety_score=0.5, status=DriverStatus.suspended),  # suspended
        ]
        session.add_all(drivers)
        session.commit()

        print("Seed complete: 4 roles, 4 users, 5 vehicles, 4 drivers.")


if __name__ == "__main__":
    seed()