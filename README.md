# AssetFlow — Enterprise Asset & Resource Management System

AssetFlow is a production-grade enterprise asset and resource management system designed to track, schedule, maintain, and audit corporate hardware, software, office space, vehicles, and equipment. 

Built using a strict internal **Modular Monolith** architecture, AssetFlow provides clean domain isolation, robust data integrity, background processing, and a feature-driven responsive interface.

---

## Key Features & Business Workflows

AssetFlow manages the lifecycle of your organization's physical assets and shared resources through five core workflows:

1. **Asset Registry**: Track critical metadata, custom attributes, categories, and real-time physical states of organizational resources.
2. **Allocation Management**: Assign equipment (e.g., laptops, peripherals) to employees. Allocations undergo custom manager approval workflows to maintain accountability.
3. **Room & Resource Bookings**: Calendar scheduling for shared rooms, labs, and equipment. Built-in concurrency handling guarantees zero double-bookings.
4. **Maintenance Lifecycle**: Report broken items and schedule routine checks. Manager approval automatically transitions asset status to `IN_REPAIR`, preventing reservation clashes.
5. **Asset Returns**: Process returns by checking/logging physical conditions, updating inventory status, and preparing items for reuse.

---

## Technology Stack

| Layer | Technology | Key Details |
| :--- | :--- | :--- |
| **Backend** | [FastAPI](https://fastapi.tiangolo.com/) | Async API framework, modular domain router structure, Python 3.10+ |
| **Database** | [PostgreSQL](https://www.postgresql.org/) + [SQLAlchemy 2.0](https://www.sqlalchemy.org/) | Relational database, base models, neon.tech cloud deployment integration |
| **Caching & Queues** | [Redis](https://redis.io/) + [Celery](https://docs.celeryq.dev/) | High-performance background workers, notification queues, mail tasks |
| **Frontend** | [Next.js 14 App Router](https://nextjs.org/) | React 18, React Server Components (RSC), TypeScript |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + PostCSS | Utility-first UI framework with custom components |

---

## Architecture: A Strict Modular Monolith

Rather than introducing network overhead and deployment complexity through premature microservices, AssetFlow utilizes a **Modular Monolith** architecture. The codebase is organized by business domain with strictly enforced logic and database boundaries.

### Strict 4-Tier Layering Model
Inside each module (e.g. `assets`, `bookings`, `users`), execution flows through a top-to-bottom standard pattern:
```
[Routes (HTTP Layer)] ➔ [Service (Business Logic)] ➔ [Repository (DB Operations)] ➔ [Models (SQLAlchemy Schema)]
```
- **`routes.py`**: Zero business logic. Handles API routing, executes Pydantic schemas validation, and calls the appropriate service.
- **`service.py`**: The orchestrator of business rules (e.g., executing the state transitions machine, validating availability).
- **`repository.py`**: Performs isolated CRUD/queries using SQLAlchemy.
- **`models.py`**: Declares database schemas.

---

## Project Structure

```
AssetFlow/
├── backend/                  # FastAPI Modular Monolith Backend
│   ├── app/
│   │   ├── api/              # API Version Routers & Core Enpoints
│   │   ├── core/             # Configuration & Security (JWT, Hashing)
│   │   ├── db/               # PostgreSQL Database connections & Session engine
│   │   ├── integrations/     # External integrations & API clients
│   │   ├── modules/          # Domain-Specific Modules (Routes, Services, Repositories)
│   │   │   ├── auth/         # JWT Authentication & Tokens
│   │   │   ├── users/        # User Accounts & Directory
│   │   │   ├── assets/       # Hardware, Equipment & Inventory
│   │   │   ├── allocations/  # Employee Assignments & Approvals
│   │   │   ├── bookings/     # Room & Vehicle Reservations
│   │   │   ├── maintenance/  # Repair Work Orders & Condition Checklists
│   │   │   ├── categories/   # Classification (IT, Office, Vehicles)
│   │   │   ├── departments/  # Organizational Structure
│   │   │   └── ...           # Audits, Transfers, Notifications, Reports
│   │   ├── workers/          # Celery worker background tasks
│   │   └── main.py           # FastAPI entry point
│   ├── pyproject.toml        # Poetry packaging and dependency manager configuration
│   └── alembic.ini           # Database migration configuration
│
└── frontend/                 # Next.js 14 Client Frontend
    ├── src/
    │   └── app/
    │       ├── (auth)/       # Authentication pages (Login, Register)
    │       └── (dashboard)/  # Enterprise Management Dashboard Layout
    │           ├── dashboard/# Live Overview Stats
    │           ├── assets/   # Asset Catalog & Actions
    │           ├── bookings/ # Calendar Booking System
    │           ├── maintenance/ # Ticket management
    │           ├── allocations/ # Device assignments
    │           └── ...       # Settings, Reports, Notifications, Settings
    ├── package.json          # Node script and dependencies
    └── tailwind.config.ts    # Design token system
```

---

## Setup & Local Development

### 1. Backend Setup

Prerequisites: Python 3.10+, PostgreSQL, Redis.

```bash
# Navigate to backend directory
cd backend

# Install dependencies using Poetry
poetry install

# Set up your environment file (.env)
# Create a .env file containing:
# DATABASE_URL=postgresql://user:password@localhost:5432/assetflow
# REDIS_URL=redis://localhost:6379/0

# Run database migrations / seed script
poetry run python seed_test_data.py

# Launch local FastAPI dev server
poetry run uvicorn app.main:app --reload
```

FastAPI docs will be available at `http://localhost:8000/docs`.

### 2. Frontend Setup

Prerequisites: Node.js 18+.

```bash
# Navigate to frontend directory
cd ../frontend

# Install node dependencies
npm install

# Run the next.js dev server
npm run dev
```

Open `http://localhost:3000` to view the asset management web application.

---

## Further Reading
- For deeper technical design rationale, database boundary rules, scaling plans, and architectural conventions, see [ARCHITECTURE.md](file:///c:/Users/arjun/Downloads/AssetFlow-main/AssetFlow-main/ARCHITECTURE.md).
- To read a user-focused walkthrough guide on features, view the [WORKFLOW](file:///c:/Users/arjun/Downloads/AssetFlow-main/AssetFlow-main/WORKFLOW).
