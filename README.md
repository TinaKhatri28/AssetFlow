# AssetFlow — Enterprise Asset & Resource Management System

This repository contains the production-grade skeleton structure for AssetFlow.

- See `ARCHITECTURE.md` for the full system design write-up: monolith-vs-microservices
  justification, complete folder structure rationale, request flow, scaling plan,
  common mistakes to avoid, and naming conventions.
- `backend/` — FastAPI modular monolith (PostgreSQL + Redis + Celery)
- `frontend/` — Next.js App Router client (feature-based structure)

This is a structural skeleton only (empty placeholder files) — no business logic
has been implemented yet, by design, per the architecture-first review.
