# CLAUDE.md

Shared instructions for Claude Code on this project. Every team member's Claude reads this file, so
keep it current when a convention or decision changes. Setup commands are in [README.md](README.md).

## Project

UNC Research Policy Navigator (COMP 523). Clients: Jeanne Lovmo and Quinton Johnson, UNC Office of
the Vice Chancellor for Research, Research Compliance Services.

Researchers **browse topics**, **search policies** (keyword), or **ask a question** (RAG answer with
citations). Admins manage policy content, FAQs and topics, and view analytics (questions asked,
unanswered questions, feedback). Two roles: `researcher` and `admin`.

Product rules that affect code:
- Every AI answer must cite the policy source(s) it used. It is not an open-ended chatbot.
- If retrieval can't support a confident answer, say so and refer the user to the relevant
  compliance office. Never guess.
- Answers are informational guidance, not compliance determinations, and the UI must say so.
- Browse, Search and Ask are equally prominent entry points; none is the "main" one.
- Only curated, public or client-approved documents. No confidential records, no live
  integration with IRB, COI or other enterprise systems.
- Admins can mark documents authoritative. Documents are archived, never hard-deleted without
  explicit admin confirmation.

## Layout

```
backend/    FastAPI app (app/), Alembic migrations (alembic/), pytest tests (tests/)
frontend/   React + TypeScript + Vite; nginx.conf.template for production
docker-compose.yml   local dev stack: db (Postgres + pgvector), backend, frontend
.github/workflows/   ci.yml (lint, tests, builds), branch-rules.yml (PR source/branch names)
```

## Commands

The Python venv is at the **repo root** (`.venv`), not in `backend/`. Use `.venv/bin/...` or an
activated venv; run backend commands from `backend/`.

- Full stack: `docker compose up --build` (app on 5173, API on 8000, Postgres on 5432)
- Backend tests: `cd backend && pytest`. Coverage must stay at **100%**, and CI fails otherwise.
- Backend lint: `cd backend && ruff check . && ruff format --check .`
- Frontend: `cd frontend && npm run lint && npm run build` (build includes the type-check)
- New migration: `cd backend && alembic revision --autogenerate -m "..."`, then review the file.

Run the relevant tests and lint before saying a change is done.

## Architecture decisions

- **API paths:** every FastAPI route is under `/api`. The frontend only uses relative `/api/...`
  paths through `frontend/src/api/client.ts`. Vite proxies `/api` in dev; nginx does it in
  production. Don't hardcode backend URLs or add CORS workarounds in the frontend.
- **Database:** plain PostgreSQL + pgvector, accessed only through SQLAlchemy 2.0 in the backend.
  Schema changes go through Alembic migrations, never manual SQL. Supabase, if used at all, is
  just a hosted Postgres: no Supabase client SDK, Supabase Auth or row-level security. The app
  must run against any Postgres via `DATABASE_URL`.
- **Auth:** authentication (who you are) is separate from authorization (your role).
  - Semester build: a mock login provider that models UNC Onyen login.
  - Later: UNC Shibboleth SSO (sso.unc.edu), likely a proxy in front of the app passing identity
    in headers. Contact: David Cowig.
  - Either way, the backend resolves the user, then reads their role from our own users/roles
    tables. Keep the auth provider behind an interface so it can be swapped.
- **Config:** settings come from environment variables via `app/config.py` (pydantic-settings).
  Never commit secrets; `.env` is gitignored and `.env.example` documents the variables.
- **External AI calls** (LLM, embeddings) go behind interfaces so tests can mock them. Tests must
  never call real AI APIs.
- **Deployment target:** Carolina CloudApps (OpenShift). Images must run as non-root with an
  arbitrary UID; the frontend prod image is nginx-unprivileged on port 8080.

## Git conventions

- Flow: `feature/*` → `dev` (default) → `qa` → `main`. Never commit directly to dev, qa or main.
- Branch names: `feature/`, `fix/`, `chore/`, `docs/`, `refactor/` or `test/` plus a lowercase
  name (`[a-z0-9._-]`). CI rejects PRs into dev that don't match.
- Commit messages: a short imperative title, a blank line, then a description of what changed and
  why. Only trivial changes (typos, formatting) may skip the description.
- Prefer several focused commits over one large one.
- Don't push, open PRs or merge unless the user asks.

## Open questions

Update this list as they get answered.
- Can telemetry (researchers' questions, Onyens) be stored off UNC infrastructure, e.g. in
  Supabase cloud?
- Which LLM and embedding providers are approved for UNC use?
- Exact SSO integration pattern on CloudApps, and the access timeline.
- Whether the repo must move to a UNC GitHub organization.
