# One Health

Full-stack platform for the One Health Student Society — a NestJS API, Next.js frontend, PostgreSQL database, Redis-backed job queues, and Cloudflare R2 media storage.

## Architecture

```
Next.js (frontend)          NestJS (backend)
       │                           │
       │  /api/v1/* (dev proxy)    │
       └───────────┬───────────────┘
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
 PostgreSQL      Redis        Cloudflare R2
 (data)       (BullMQ jobs)   (media CDN)
```

| Layer | Tech | Default port |
|-------|------|--------------|
| Frontend | Next.js 16 | `3000` |
| Backend | NestJS 11 | `3001` |
| Database | PostgreSQL 16 | `5432` |
| Queue | Redis 7 | `6379` |

---

## Prerequisites

Install these before you start:

- [Node.js](https://nodejs.org/) **20+** (LTS recommended)
- [pnpm](https://pnpm.io/) — backend package manager (`npm install -g pnpm`)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — runs PostgreSQL and Redis locally
- Git

Optional (production features):

- [Cloudflare R2](https://developers.cloudflare.com/r2/) account — media uploads
- [Resend](https://resend.com/) API key — transactional / newsletter email

---

## Quick start (local development)

### 1. Clone and enter the project

```bash
git clone <your-repo-url> one-health
cd one-health
```

### 2. Start PostgreSQL and Redis with Docker

From the **project root**:

```bash
docker compose up -d
```

Verify containers are healthy:

```bash
docker compose ps
```

You should see `one-health-postgres` and `one-health-redis` with status **healthy**.

**Connection details (defaults):**

| Service | Host | Port | User | Password | Database |
|---------|------|------|------|----------|----------|
| PostgreSQL | `localhost` | `5432` | `onehealth` | `onehealth` | `onehealth` |
| Redis | `localhost` | `6379` | — | — | — |

Stop services when done:

```bash
docker compose down
```

Remove data volumes (full reset):

```bash
docker compose down -v
```

---

### 3. Backend setup

```bash
cd backend
pnpm install
```

Copy environment file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Edit `backend/.env` if needed. The defaults work with Docker Compose out of the box.

Generate Prisma client, sync schema, apply search indexes, and seed:

```bash
pnpm db:generate
pnpm exec prisma db push
pnpm exec prisma db execute --file prisma/migrations/20260630120000_content_intelligence/migration.sql
pnpm db:seed
```

Start the API in watch mode:

```bash
pnpm start:dev
```

API available at **http://localhost:3001/api/v1**

Health check (any public route):

```bash
curl http://localhost:3001/api/v1/newsletters
```

---

### 4. Frontend setup

Open a **second terminal**:

```bash
cd frontend
npm install
```

Copy environment file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# macOS / Linux
cp .env.example .env.local
```

Set `REVALIDATE_SECRET` in `frontend/.env.local` to the **same value** as in `backend/.env` (default: `dev-revalidate-secret-change-me`).

Start Next.js:

```bash
npm run dev
```

Site available at **http://localhost:3000**

---

### 5. Log in to admin

After seeding, use the default admin account:

| Field | Value |
|-------|-------|
| URL | http://localhost:3000/login |
| Email | `admin@onehealth.com` |
| Password | `ChangeMe123!` |

Override credentials via `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `backend/.env` **before** running `pnpm db:seed`.

Change the password after first login in production.

---

## Environment variables

### Backend (`backend/.env`)

Copy from `backend/.env.example`. Required for local dev:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string (BullMQ email + analytics queues) |
| `JWT_SECRET` | Access token signing secret |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `FRONTEND_URL` | Frontend origin for CORS and cache invalidation |
| `REVALIDATE_SECRET` | Shared secret for Next.js ISR webhook |

Optional:

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Sends newsletter / notification emails |
| `EMAIL_FROM` | Sender address for Resend |
| `R2_*` | Cloudflare R2 credentials for media uploads |
| `SEED_ADMIN_*` | Default admin user for `pnpm db:seed` |

### Frontend (`frontend/.env.local`)

Copy from `frontend/.env.example`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Leave **empty** in dev — requests use same-origin `/api/v1` proxy |
| `API_URL` | Backend URL for server-side fetch (`http://localhost:3001`) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (`http://localhost:3000`) |
| `REVALIDATE_SECRET` | Must match backend `REVALIDATE_SECRET` |
| `NEXT_PUBLIC_CDN_URL` | CDN base URL for media (optional in dev) |

---

## How the frontend talks to the backend

In development, Next.js **rewrites** `/api/v1/*` to the NestJS server. The browser always calls same-origin URLs, which keeps **HTTP-only auth cookies** working.

```
Browser  →  http://localhost:3000/api/v1/auth/login
                ↓ (Next.js rewrite)
           http://localhost:3001/api/v1/auth/login
```

Server components fetch the backend directly using `API_URL=http://localhost:3001`.

Every authenticated client request uses `credentials: 'include'` — no tokens in `localStorage`.

---

## Database commands

Run from `backend/`:

| Command | Purpose |
|---------|---------|
| `pnpm db:generate` | Regenerate Prisma client after schema changes |
| `pnpm exec prisma db push` | Sync schema to DB (good for local dev) |
| `pnpm db:migrate` | Create/apply migrations (production workflow) |
| `pnpm db:deploy` | Apply migrations in CI/production |
| `pnpm db:seed` | Seed categories, settings, and admin user |
| `pnpm db:studio` | Open Prisma Studio GUI at http://localhost:5555 |

### Reset local database

```bash
docker compose down -v
docker compose up -d
cd backend
pnpm db:generate
pnpm exec prisma db push
pnpm exec prisma db execute --file prisma/migrations/20260630120000_content_intelligence/migration.sql
pnpm db:seed
```

---

## Docker reference

The root `docker-compose.yml` defines:

- **postgres** — PostgreSQL 16 with persistent volume `postgres_data`
- **redis** — Redis 7 with persistent volume `redis_data`

Useful commands:

```bash
# Start in background
docker compose up -d

# View logs
docker compose logs -f postgres
docker compose logs -f redis

# Connect to Postgres shell
docker exec -it one-health-postgres psql -U onehealth -d onehealth

# Connect to Redis CLI
docker exec -it one-health-redis redis-cli
```

---

## Project structure

```
one-health/
├── docker-compose.yml      # PostgreSQL + Redis
├── backend/                # NestJS API
│   ├── prisma/             # Schema, migrations, seed
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, newsletters, media, …)
│   │   ├── common/         # Shared helpers, events, enums
│   │   └── infrastructure/ # Redis, etc.
│   └── .env.example
├── frontend/               # Next.js site
│   ├── app/                # App Router pages
│   ├── components/
│   ├── lib/                # API client, auth, image helpers
│   └── .env.example
└── README.md
```

---

## API overview

Base URL: `http://localhost:3001/api/v1`

| Area | Examples |
|------|----------|
| Public | `GET /newsletters`, `GET /newsletters/:slug`, `GET /search?q=` |
| Auth | `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh` |
| User | `GET /users/me` |
| Subscribers | `POST /subscribers` |
| SEO | `GET /sitemap.xml`, `GET /rss.xml` |
| Admin | `POST /newsletters`, `PATCH /newsletters/:id/publish`, `POST /media/upload` |

Responses follow a consistent shape:

```json
{ "success": true, "message": "...", "data": { } }
```

---

## Background workers (BullMQ)

When the backend starts, it also runs in-process workers for:

- **Email queue** — newsletter emails after publish
- **Analytics queue** — page views and search tracking

These require **Redis** to be running. If Redis is down, the API still starts but queue jobs will fail until Redis is available.

---

## Optional: Cloudflare R2 (media uploads)

Without R2 credentials, uploads succeed in the database but files are not stored remotely (placeholder URLs are returned).

1. Create an R2 bucket in Cloudflare
2. Generate API tokens with read/write access
3. Set in `backend/.env`:

```env
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
R2_BUCKET=one-health-media
R2_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://cdn.yourdomain.com
```

4. Set `NEXT_PUBLIC_CDN_URL` in `frontend/.env.local` to match `R2_PUBLIC_URL`

---

## Optional: Resend (email)

Without `RESEND_API_KEY`, publishing a newsletter still queues jobs but delivery is skipped (logged as a warning).

```env
RESEND_API_KEY=re_xxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

---

## Production notes

- Set strong `JWT_SECRET` and `JWT_REFRESH_SECRET` (32+ random characters)
- Set `NODE_ENV=production`
- Use `pnpm db:deploy` instead of `db push`
- Point `FRONTEND_URL` and CORS to your real domain
- Use managed PostgreSQL and Redis (e.g. Neon, Supabase, Upstash) instead of Docker
- Configure R2 + CDN for media
- Set `REVALIDATE_SECRET` on both backend and frontend (Vercel env vars)

---

## Troubleshooting

### `DATABASE_URL` connection refused

- Ensure Docker is running: `docker compose ps`
- Wait for Postgres healthcheck to pass before migrating
- Confirm port `5432` is not used by another Postgres instance

### Redis / BullMQ errors in logs

- Ensure Redis container is up: `docker compose ps`
- Check `REDIS_URL=redis://localhost:6379` in `backend/.env`

### Auth / login not working in the browser

- Frontend must use the `/api/v1` proxy (`NEXT_PUBLIC_API_URL` empty in dev)
- Backend `FRONTEND_URL` should be `http://localhost:3000`
- Clear cookies for `localhost` and try again

### Articles page empty

- Run `pnpm db:seed` and publish a newsletter via the admin API, or
- Check backend is running on port `3001`
- Check `API_URL` in `frontend/.env.local`

### Prisma migration errors

For a clean local setup, prefer:

```bash
pnpm exec prisma db push
```

Then apply the search trigger SQL file as shown in step 3.

### Port already in use

Change `PORT` in `backend/.env` or stop the conflicting process. Update `API_URL` in `frontend/.env.local` to match.

---

## Scripts cheat sheet

**Project root**

```bash
docker compose up -d          # Start Postgres + Redis
docker compose down           # Stop services
```

**Backend (`backend/`)**

```bash
pnpm install
pnpm start:dev                # Dev server with hot reload
pnpm build                    # Production build
pnpm start:prod               # Run production build
pnpm lint
pnpm test
```

**Frontend (`frontend/`)**

```bash
npm install
npm run dev                   # Dev server
npm run build                 # Production build
npm start                     # Run production build
npm run lint
```

---

## License

Private project — see repository settings for license terms.
