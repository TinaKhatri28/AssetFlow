# AssetFlow — System Architecture & Codebase Structure

**Stack:** FastAPI · PostgreSQL · Redis · Next.js
**Author role:** Principal Software Architect review
**Status:** Production-grade, pre-implementation design

---

## 1. High-Level Architecture

### Monolith vs Microservices — decision

**Verdict: Modular Monolith.** Microservices are the wrong choice for this project *today*, and I'm calling that out before it becomes a problem instead of after.

Reasons:

- **Domain coupling is high.** Allocation depends on Assets + Employees. Transfer depends on Allocation + Approval. Maintenance depends on Assets + Notifications. Audit depends on almost everything. In a real microservice split, every one of these boundaries becomes a network call, a retry policy, a distributed transaction problem, and a versioning headache. You'd be paying the distributed-systems tax with none of the scaling benefit, because the actual load (asset CRUD + bookings + reports for an internal enterprise tool) is nowhere near the scale that justifies it.
- **Team size doesn't justify it.** Microservices pay off when you have multiple independent teams that need to deploy independently. This is a 1→10 developer project. 10 developers can absolutely work productively in one well-modularized codebase; they cannot productively run 12 separate services, 12 CI pipelines, and a service mesh.
- **Operational cost.** Every microservice = its own deployment, its own DB migration story, its own observability setup, its own on-call surface. For a hackathon-to-production trajectory, that's a distraction from building the product.

**The compromise that gives you both:** a **modular monolith** — one deployable backend, but internally partitioned into strict domain modules with enforced boundaries (no direct cross-module DB queries, only service-to-service calls). This gives you:

- Fast local development, one process to run, one DB, simple transactions.
- A codebase that is *already* shaped like microservices internally — so if you ever need to peel off "Notifications" or "Reports" into their own service (the two most legitimately independent domains here), you extract a folder, not rewrite an architecture.

### Why this structure

- **Domain-driven modules** instead of `routes/ controllers/ utils/` flat dumping grounds — each module (`assets`, `bookings`, `maintenance`, `audits`, ...) owns its own routes, schemas, service logic, repository, and models. This mirrors how the business actually thinks about the system, which is what makes 10 new developers productive on day one instead of week three.
- **Strict layering inside every module**: `route → service → repository → model`. This is non-negotiable because it's the single biggest predictor of whether a codebase survives 2 years of feature requests without becoming unmaintainable.
- **Shared infrastructure separated from domain logic**: config, DB session, Redis client, security, background workers, third-party integrations (Cloudinary, email, QR/barcode, AI prediction) all live outside the domain modules, so no module secretly owns global concerns.

### Tradeoffs (stated honestly)

| Tradeoff | Cost | Why it's acceptable here |
|---|---|---|
| Single deployable | A bug in one module can theoretically affect uptime of all | Mitigated by module boundaries + tests; acceptable for an internal enterprise tool, not a public multi-tenant SaaS at first |
| Single DB (initially) | All modules share one Postgres instance | Fine until a single module's write load genuinely outgrows the others — see Section 5 |
| Not "true" microservices | You lose independent scaling/deployment | You gain simplicity, transactional integrity, and dramatically lower operational overhead — the right trade for current scale |

---

## 2. Complete Folder Structure

```
AssetFlow/
├── backend/
│   ├── app/
│   │   ├── main.py                         # FastAPI app factory, startup/shutdown hooks
│   │   │
│   │   ├── core/                           # cross-cutting, framework-level concerns only
│   │   │   ├── config.py                   # Settings (pydantic-settings), env vars
│   │   │   ├── security.py                 # JWT encode/decode, password hashing
│   │   │   ├── logging_config.py
│   │   │   ├── exceptions.py               # base AppException + global handler wiring
│   │   │   ├── middleware.py               # request-id, timing, error-shaping middleware
│   │   │   └── constants.py                # enums: AssetStatus, RoleType, etc.
│   │   │
│   │   ├── db/
│   │   │   ├── base.py                     # SQLAlchemy Base + naming conventions
│   │   │   ├── session.py                  # engine, SessionLocal, get_db dependency
│   │   │   ├── redis.py                    # Redis connection pool
│   │   │   └── init_db.py                  # first-run seed (roles, admin user)
│   │   │
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── api_router.py           # includes every module's router
│   │   │       └── deps.py                 # get_current_user, require_role(), pagination params
│   │   │
│   │   ├── modules/                        # <-- the domain-driven heart of the system
│   │   │   ├── auth/
│   │   │   │   ├── routes.py
│   │   │   │   ├── schemas.py              # pydantic: LoginRequest, TokenResponse...
│   │   │   │   ├── service.py              # login logic, token issuance, email verify
│   │   │   │   ├── repository.py           # user lookups (delegates to users module model)
│   │   │   │   └── exceptions.py
│   │   │   │
│   │   │   ├── users/                      # Employees + Roles + Departments-of-user
│   │   │   │   ├── routes.py
│   │   │   │   ├── schemas.py
│   │   │   │   ├── service.py              # promote/suspend/change department
│   │   │   │   ├── repository.py
│   │   │   │   └── models.py               # User, Role
│   │   │   │
│   │   │   ├── departments/
│   │   │   │   ├── routes.py
│   │   │   │   ├── schemas.py
│   │   │   │   ├── service.py
│   │   │   │   ├── repository.py
│   │   │   │   └── models.py               # Department (self-referential parent_id)
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   ├── routes.py / schemas.py / service.py / repository.py / models.py
│   │   │   │   # AssetCategory: warranty rules, useful life, maintenance frequency
│   │   │   │
│   │   │   ├── assets/
│   │   │   │   ├── routes.py
│   │   │   │   ├── schemas.py
│   │   │   │   ├── service.py              # asset code generation (AF-0001...), lifecycle transitions
│   │   │   │   ├── repository.py
│   │   │   │   ├── models.py               # Asset (status: Available/Allocated/Reserved/Maintenance/Lost/Retired/Disposed)
│   │   │   │   └── lifecycle.py            # explicit state machine, not scattered if/else
│   │   │   │
│   │   │   ├── allocations/
│   │   │   │   ├── routes.py / schemas.py / service.py / repository.py
│   │   │   │   └── models.py               # AssetAllocation — enforces "cannot allocate twice"
│   │   │   │
│   │   │   ├── transfers/
│   │   │   │   ├── routes.py / schemas.py / service.py / repository.py
│   │   │   │   └── models.py               # AssetTransfer + approval workflow + history
│   │   │   │
│   │   │   ├── returns/
│   │   │   │   ├── routes.py / schemas.py / service.py / repository.py
│   │   │   │   └── models.py               # ReturnRequest, condition check
│   │   │   │
│   │   │   ├── bookings/
│   │   │   │   ├── routes.py
│   │   │   │   ├── schemas.py
│   │   │   │   ├── service.py              # conflict detection algorithm lives here
│   │   │   │   ├── repository.py
│   │   │   │   └── models.py               # Booking (resource_type, start, end)
│   │   │   │
│   │   │   ├── maintenance/
│   │   │   │   ├── routes.py / schemas.py / service.py / repository.py
│   │   │   │   └── models.py               # MaintenanceTicket, Technician assignment
│   │   │   │
│   │   │   ├── audits/
│   │   │   │   ├── routes.py / schemas.py / service.py / repository.py
│   │   │   │   └── models.py               # AuditCycle, AuditItem
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── routes.py
│   │   │   │   ├── service.py              # orchestrates queries across modules (read-only)
│   │   │   │   └── exporters/              # pdf_exporter.py, excel_exporter.py, csv_exporter.py
│   │   │   │
│   │   │   ├── notifications/
│   │   │   │   ├── routes.py / schemas.py / service.py / repository.py
│   │   │   │   └── models.py               # Notification, delivery status
│   │   │   │
│   │   │   └── dashboard/
│   │   │       ├── routes.py
│   │   │       └── service.py              # aggregates cards + chart data (read-only, cached)
│   │   │
│   │   ├── workers/                        # background/async processing
│   │   │   ├── celery_app.py
│   │   │   └── tasks/
│   │   │       ├── notification_tasks.py   # email/in-app dispatch
│   │   │       ├── maintenance_prediction_tasks.py  # AI-based prediction (bonus feature)
│   │   │       ├── report_generation_tasks.py
│   │   │       └── reminder_tasks.py       # SLA reminders, return-due-tomorrow, audit start
│   │   │
│   │   ├── integrations/                   # third-party / external system adapters
│   │   │   ├── storage/                    # cloudinary_client.py, local_storage.py (common interface)
│   │   │   ├── email/                      # smtp_client.py / provider adapter
│   │   │   ├── qr_barcode/                 # qr_generator.py, barcode_generator.py
│   │   │   └── ai_prediction/              # maintenance prediction model client
│   │   │
│   │   ├── shared/                         # generic reusable code, NOT business logic
│   │   │   ├── base_repository.py          # generic CRUD repository base class
│   │   │   ├── base_schema.py              # BaseModel with ORM config, timestamps mixin
│   │   │   ├── pagination.py
│   │   │   └── utils/
│   │   │       ├── date_utils.py
│   │   │       └── code_generator.py       # generic sequence/code generator (used by assets)
│   │   │
│   │   └── tests/
│   │       ├── unit/                       # mirrors modules/ structure 1:1
│   │       ├── integration/
│   │       └── e2e/
│   │
│   ├── migrations/                         # Alembic
│   │   ├── versions/
│   │   └── env.py
│   ├── scripts/                            # one-off ops scripts (seed data, backfills)
│   ├── docker/
│   │   └── Dockerfile
│   ├── docker-compose.yml
│   ├── pyproject.toml
│   ├── alembic.ini
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/                            # Next.js App Router — routing ONLY
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── signup/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx              # sidebar/topbar shell, role-gated nav
│   │   │   │   ├── dashboard/page.tsx
│   │   │   │   ├── departments/page.tsx
│   │   │   │   ├── employees/page.tsx
│   │   │   │   ├── categories/page.tsx
│   │   │   │   ├── assets/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [assetId]/page.tsx
│   │   │   │   ├── allocations/page.tsx
│   │   │   │   ├── transfers/page.tsx
│   │   │   │   ├── returns/page.tsx
│   │   │   │   ├── bookings/page.tsx
│   │   │   │   ├── maintenance/page.tsx
│   │   │   │   ├── audits/page.tsx
│   │   │   │   ├── reports/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   │
│   │   ├── features/                       # domain logic — mirrors backend modules
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/                  # useLogin, useCurrentUser
│   │   │   │   ├── api/                    # authApi.ts (fetch wrappers, react-query hooks)
│   │   │   │   └── types.ts
│   │   │   ├── assets/
│   │   │   │   ├── components/             # AssetTable, AssetForm, AssetCard, QRScanner
│   │   │   │   ├── hooks/
│   │   │   │   ├── api/
│   │   │   │   └── types.ts
│   │   │   ├── departments/
│   │   │   ├── employees/
│   │   │   ├── allocations/
│   │   │   ├── transfers/
│   │   │   ├── returns/
│   │   │   ├── bookings/                   # calendar view, conflict UI
│   │   │   ├── maintenance/
│   │   │   ├── audits/
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   └── dashboard/                  # chart components (Recharts wrappers)
│   │   │
│   │   ├── components/                     # shared, dumb, feature-agnostic UI only
│   │   │   ├── ui/                         # shadcn primitives (button, dialog, table...)
│   │   │   ├── layout/                     # Sidebar, Topbar, PageHeader
│   │   │   └── charts/                     # generic chart wrapper components
│   │   │
│   │   ├── lib/
│   │   │   ├── api-client.ts               # axios/fetch instance, interceptors (JWT attach)
│   │   │   ├── query-client.ts             # react-query client config
│   │   │   └── utils.ts
│   │   │
│   │   ├── store/                          # global client state (zustand) — session/UI only
│   │   ├── hooks/                          # truly generic hooks (useDebounce, useMediaQuery)
│   │   ├── types/                          # shared cross-feature types
│   │   ├── config/                         # role-permission map, nav config
│   │   └── middleware.ts                   # route guarding by auth/role
│   │
│   ├── public/
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── package.json
│   └── .env.example
│
└── README.md
```

---

## 3. Folder Responsibility Breakdown

### `core/`
- **Goes here:** settings, JWT logic, global exception handler wiring, request middleware, app-wide enums/constants.
- **Never goes here:** anything that touches a specific domain table (e.g. asset status transitions), any DB queries.
- **Common mistake:** turning `core/` into a junk drawer — "I don't know where this goes, put it in core" is how every project's `core/` becomes 4,000 lines of unrelated code within 6 months.

### `db/`
- **Goes here:** engine/session setup, Base declarative class, Redis connection, seed script.
- **Never goes here:** model definitions (those live inside each module), business queries.
- **Common mistake:** defining all SQLAlchemy models in one `db/models.py` file — this is the #1 way flat structures happen by accident even inside an otherwise "clean" project.

### `api/v1/`
- **Goes here:** the router aggregator, and *shared* dependencies genuinely used across modules (`get_current_user`, `require_role`).
- **Never goes here:** module-specific routes — those belong inside `modules/<name>/routes.py`. `api/v1/` should never grow a `routes/` subfolder with 15 files in it; that's the flat structure this whole design exists to avoid.
- **Common mistake:** putting `get_current_user` logic (DB lookups) directly in the dependency function instead of delegating to `modules/auth/service.py`.

### `modules/<domain>/`
- **Goes here:** everything about that one domain — routes (HTTP layer only: parse request, call service, return response), schemas (request/response shape), service (business logic, orchestration, transaction boundaries), repository (all DB queries for this domain's tables), models (SQLAlchemy ORM classes).
- **Never goes here:** direct cross-module DB queries. If `transfers` needs asset data, it calls `assets.service`, it does not import `assets.models` and query directly. This single rule is what keeps a monolith "modular" instead of accidentally becoming one giant tangled schema.
- **Common mistake:** putting query logic in `service.py` instead of `repository.py` ("it's just one query, I'll inline it") — six months later nobody can find where a given table is actually queried from, and the same query is duplicated four times with slightly different bugs.

### `workers/`
- **Goes here:** Celery app config, all background tasks (notifications, reminders, AI prediction jobs, bulk report generation).
- **Never goes here:** logic that must run synchronously as part of a user-facing request/response cycle.
- **Common mistake:** calling `send_email()` synchronously inside `service.py` "for now" — this is exactly how a simple allocation request ends up timing out because SMTP is slow. Anything with I/O latency and no immediate user-facing result belongs in a task queue from day one.

### `integrations/`
- **Goes here:** thin adapters to external systems (Cloudinary/local storage, SMTP/email provider, QR/barcode libraries, AI prediction service) behind a common interface.
- **Never goes here:** business logic about *when* to call these things — that's the service layer's job. `integrations/storage/` knows how to upload a file; it doesn't know that an asset image upload should trigger a notification.
- **Common mistake:** hardcoding "Cloudinary" calls directly inside `assets/service.py` — makes it impossible to swap providers or run local dev without live credentials.

### `shared/`
- **Goes here:** truly generic, domain-agnostic code — a generic paginator, a base repository class with common CRUD, a code-generator utility (used by `assets` for `AF-0001` sequences, potentially reused elsewhere).
- **Never goes here:** anything with a single caller wrapped in "shared" just because it feels reusable. If only `assets` uses it, it lives in `assets/`.

### `tests/`
- **Goes here:** unit tests mirroring `modules/` 1:1 (`tests/unit/modules/assets/test_service.py`), integration tests hitting a real test DB, e2e tests hitting the full API.
- **Common mistake:** only testing routes with mocked services — this proves the HTTP layer works but never proves the business logic is correct. Test the service layer directly and heavily; that's where the business rules ("cannot allocate twice," "no double booking") actually live.

### Frontend `app/` vs `features/`
- **`app/`** is routing only — pages compose feature components, nothing else. A page file should be short.
- **`features/`** owns actual UI logic, data fetching hooks, and types per domain.
- **Never** put a data-fetching call or business rule directly inside an `app/**/page.tsx` file — it becomes untestable and unreusable the moment a second page needs the same data.
- **Common mistake:** dumping every component into one flat `components/` folder regardless of whether it's a generic button or an `AssetAllocationForm` — this is the frontend equivalent of the flat backend structure this whole document argues against.

---

## 4. Request Flow Explanation

Example: **Employee requests an asset transfer.**

```
1. Client (Next.js)
   features/transfers/api/transfersApi.ts → POST /api/v1/transfers

2. api/v1/api_router.py
   routes to modules/transfers/routes.py

3. modules/transfers/routes.py  (HTTP layer — thin)
   - Parses & validates request body against schemas.TransferRequestCreate
   - Extracts current_user via api/v1/deps.get_current_user
   - Calls: transfer_service.create_transfer_request(db, current_user, payload)
   - Returns schemas.TransferResponse — NO business logic here

4. modules/transfers/service.py  (business logic layer)
   - Checks: is asset currently allocated to this user? Is it already mid-transfer?
   - Calls modules/assets/service.py (cross-module call, never cross-module DB query)
     to confirm the asset's current status
   - Applies business rule: only one active transfer per asset
   - Calls repository.create(...) to persist the request
   - Enqueues a notification_tasks.notify_manager task (async, non-blocking)
   - Returns a domain object / DTO — not a raw ORM row

5. modules/transfers/repository.py  (data access layer)
   - Executes the actual SQLAlchemy INSERT
   - Contains no decision-making — pure data access

6. db/session.py → PostgreSQL
   - Transaction commits

7. Response bubbles back up:
   repository → service → route → Pydantic schema → JSON → Client

8. Side effect (async, decoupled):
   workers/tasks/notification_tasks.py picks up the queued job,
   sends the "Transfer Requested" email/in-app notification via
   integrations/email, independent of the original request's response time.
```

The critical property: **each layer only talks to the layer directly below it**, and cross-domain communication happens **service-to-service**, never **repository-to-repository** or **route-to-repository**. This is what makes the system testable (mock one layer down) and safely extractable into a microservice later (the service boundary is already the API boundary).

---

## 5. Scaling Extensions

### When traffic increases
- Add Redis-backed caching at the **service layer** for read-heavy, slow-changing data: dashboard aggregates, category rules, department trees. Cache invalidation triggered from the relevant module's service on writes.
- Move all notification, report-export, and AI-prediction work to Celery workers (already structured for this) — scale worker count independently of the API process.
- Split read replicas for PostgreSQL once reporting queries start competing with transactional writes; `modules/reports/service.py` is already isolated enough to point at a read replica connection without touching other modules.
- Add pagination + cursor-based queries everywhere via `shared/pagination.py` before this becomes a firefighting exercise, not after.

### When the team grows
- Each `modules/<domain>/` folder is effectively an "owned" unit — assign domain ownership to pairs/squads (e.g. one dev owns `assets/ + allocations/ + transfers/`, another owns `bookings/ + maintenance/`). The enforced module boundary means two squads can work in parallel with minimal merge conflicts.
- Introduce a lightweight architecture decision record (ADR) folder and a `CONTRIBUTING.md` codifying the layering rule, before it's "tribal knowledge" that erodes as new hires join.
- Add module-level CODEOWNERS in git so PRs touching `modules/audits/` automatically require the audit-domain owner's review.

### When microservices are introduced (if ever justified)
Because module boundaries are already enforced at the service-call level (never direct cross-module DB access), extraction is mechanical:
1. `reports` and `notifications` are the best first candidates — they're read-heavy/write-heavy respectively and have the fewest tight coupling requirements back to core asset state.
2. Move the module folder to its own repo/deployable, replace in-process service calls with HTTP/gRPC calls or an event bus (e.g. publish `TransferApproved` event, `notifications` service subscribes).
3. The route layer and schemas barely change — they were already the module's public contract.

**Explicit warning:** do NOT introduce microservices before there's a real, measured reason (a specific module's load, deploy cadence, or team size genuinely demands independent scaling). Premature extraction here would be pure tech debt with no payoff.

---

## 6. Common Mistakes (Called Out Bluntly)

- **Fat routes.** Putting `if asset.status == "allocated": raise ...` directly inside `routes.py`. This is the single most common beginner mistake in FastAPI projects — routes should be 5–15 lines: parse, delegate, return. If you can't unit test your business rule without spinning up an HTTP client, it's in the wrong layer.
- **One giant `models.py`.** Tempting because SQLAlchemy relationships are easy to define in one file. This is exactly what makes a monolith unmodular — six months in, nobody can tell which module "owns" a table, and every module ends up importing every other module's models directly, which defeats the entire point of domain separation.
- **Skipping the repository layer "because it's just one query."** This is how the same query gets copy-pasted into three services with three subtly different WHERE clauses, and a bug fix in one place doesn't fix the other two.
- **Synchronous side effects.** Sending emails, generating PDFs, or calling the AI prediction service inline inside a request handler. This directly causes the "audits take weeks" and "slow dashboard" problems this system is supposed to solve — don't rebuild the same class of problem with different tooling.
- **No explicit state machine for Asset lifecycle.** Scattering `if/elif` status checks across `allocations/service.py`, `returns/service.py`, and `maintenance/service.py` independently *will* eventually allow an illegal transition (e.g. approving a transfer for an asset already in maintenance). Centralize legal transitions in `modules/assets/lifecycle.py` and have every other module call into it, not reimplement it.
- **"Cannot allocate twice" enforced only in application code.** Also add a DB-level unique/partial constraint (e.g. a partial unique index on `asset_id` where `status = 'active'` in the allocations table) — application logic can race under concurrency; the database is the last line of defense.
- **Booking conflict detection done with naive overlapping-date application logic run after the fact.** Use a DB-level exclusion constraint (Postgres `EXCLUDE USING gist`) on resource + time range wherever possible — don't rely purely on a service-layer check-then-insert, which has a race condition window.
- **Treating `reports/` as "just read from the other modules' tables directly."** It's tempting since reports are read-only, but direct cross-module table joins from `reports/repository.py` recreate tight coupling. Prefer well-defined read methods exposed by each module's service/repository, even for reporting.
- **Frontend: prop-drilling instead of feature-scoped state.** As soon as `assets/`, `allocations/`, and `dashboard/` all need overlapping asset state, resist the urge to lift everything into one giant global store — keep state feature-scoped and use React Query for server state; only genuinely global concerns (auth session, active org) belong in the global store.
- **No seed/migration discipline.** Running ad hoc SQL against the dev DB "just this once" instead of writing an Alembic migration. This is how staging and production silently drift apart within weeks.

---

## 7. Naming Conventions & Example Module Breakdown

### Naming conventions
- **Backend files:** `snake_case.py`. **Classes:** `PascalCase`. **DB tables:** plural snake_case (`asset_allocations`, `maintenance_tickets`).
- **Pydantic schemas:** suffix by purpose — `AssetCreate`, `AssetUpdate`, `AssetResponse`, `AssetListResponse`. Never reuse one schema for both request and response bodies once fields diverge (e.g. response includes `id`, `created_at`; create request doesn't).
- **Services:** verbs — `create_transfer_request`, `approve_transfer`, `reject_transfer`. Not generic `handle()` or `process()`.
- **Repositories:** data-shaped names — `get_by_id`, `list_by_department`, `exists_active_allocation`.
- **Frontend components:** `PascalCase.tsx`; hooks: `useThing.ts`; API modules: `thingApi.ts`.
- **Routes (URLs):** plural, kebab-case where multi-word: `/api/v1/asset-transfers`, `/api/v1/maintenance-tickets`.

### Example module breakdown: `modules/transfers/`

```
transfers/
├── routes.py         # POST /transfers, PATCH /transfers/{id}/approve, GET /transfers
├── schemas.py        # TransferCreate, TransferApprove, TransferResponse
├── service.py         
│     - create_transfer_request(db, user, payload)
│     - approve_transfer(db, manager, transfer_id)
│     - reject_transfer(db, manager, transfer_id, reason)
│     - get_transfer_history(db, asset_id)
├── repository.py
│     - create(db, transfer)
│     - get_by_id(db, transfer_id)
│     - list_pending_for_manager(db, manager_id)
├── models.py         # AssetTransfer ORM model
└── exceptions.py     # TransferAlreadyPendingError, AssetNotAllocatedError
```

`routes.py` never imports `repository.py` directly — it only ever talks to `service.py`. `service.py` never writes raw SQL — it only ever talks to `repository.py`. This one rule, enforced everywhere, is what keeps the "modular" in modular monolith.

---

## Final Note

This structure is intentionally boring and predictable. Every module looks like every other module. That predictability is the point — a new developer who understands `assets/` already understands `bookings/`, `maintenance/`, and `audits/` on day one, without reading a single line of their internals. That is what "production-grade" actually means in practice: not clever, but consistent, layered, and boring in all the right ways.
