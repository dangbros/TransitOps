# TransitOps

A lightweight, real-time logistics and fleet operations control center designed to solve dispatching inefficiencies, maintenance lockout errors, and operational cost auditing.

---

## What it Solves
Managing a commercial fleet involves coordinating drivers, vehicles, maintenance cycles, and trip logs. Inefficient dispatching leads to double-booking, sending vehicles under maintenance out on trips, or losing track of operating margins.

TransitOps streamlines this workflow with a connected backend state engine and a clean multi-role dashboard.

### Core Features
* **Live KPI Operations Dashboard**: Tracks overall utilization rate, active vs. pending dispatches, driver availability, operating margins (ROI), maintenance overheads, and average fuel efficiency (calculated dynamically from completed trip fuel logs).
* **Smart Dispatch Locking (State Machine)**: You cannot assign a driver or vehicle to a trip unless their database status is `"Available"`.
* **Automatic Maintenance Lockout**: When a vehicle is logged for maintenance by a Safety Officer, its database status shifts to `"In Shop"` and is **automatically hidden** from the dispatch trip dropdown. Marking maintenance complete releases it back into the available pool.
* **Auto-Dispatch**: Creating a trip moves the assigned vehicle and driver statuses to `"On Trip"` in a single database transaction. Deleting or canceling a trip automatically releases them back to `"Available"`.
* **Driver Profiles**: Drivers can log in, view their specific assignments, and update distance/odometer/fuel metrics to mark trips completed.
* **Audited Expenses & Fuel Logs**: A financial analyst view tracks fuel logs and fleet expenses, matching them to specific vehicles and trips to calculate total operational overhead.

---

## Tech Stack
* **Frontend**: React (Vite), TailwindCSS / Vanilla CSS, React Icons, React Hot Toast
* **Backend**: FastAPI, SQLModel (SQLAlchemy + Pydantic v2 validation)
* **Database**: SQLite (local setup for rapid prototyping)

---

## Quick Start

### 1. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd transitops-backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the seed script to populate roles, mock vehicles, and test users:
   ```bash
   python seed.py
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to `http://localhost:5173`.

---

## Sandbox Demo Credentials
Use these accounts to test the different role-based views of the application (password is the same for all default seeded accounts):

* **Fleet Manager**: `fleetmanager@transitops.com` (Access to all admin tabs)
* **Driver**: `driver@transitops.com` (View and complete assigned trips)
* **Safety Officer**: `safety@transitops.com` (Log and close vehicle maintenance logs)
* **Financial Analyst**: `finance@transitops.com` (Log fuel receipts and operating expenses)

**Password**: `password123`
