# Deployment Guide

This project now recommends a split free-hosting setup:

- Frontend: Netlify or Vercel
- Backend API: Koyeb
- Database: PostgreSQL hosted on an Oracle Cloud Always Free VM

This keeps the frontend static, keeps the backend easy to deploy, and avoids rewriting the app for Oracle Database.

## Architecture

```mermaid
flowchart LR
  Browser[Browser] --> FE[Netlify or Vercel]
  FE -->|HTTPS /api calls| API[Koyeb FastAPI Service]
  API -->|DATABASE_URL| DB[(PostgreSQL on Oracle Cloud VM)]
```

## Prerequisites

- Netlify account or Vercel account
- Koyeb account
- Oracle Cloud account with Always Free compute access
- GitHub repository for deployments
- Docker installed locally for backend/local validation

## Environment Variables

### Frontend

Set in Netlify or Vercel:

- `VITE_API_BASE_URL=https://your-koyeb-service.koyeb.app/api/v1`

Reference:
- [frontend/.env.example](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/.env.example)

### Backend

Set in Koyeb:

- `DATABASE_URL=postgresql+psycopg2://kids_user:strong_password@your-oracle-vm-public-ip:5432/kids_bible_db`
- `SECRET_KEY=<strong-random-secret>`
- `ENVIRONMENT=production`
- `CORS_ORIGINS=https://your-netlify-site.netlify.app,https://your-vercel-site.vercel.app`
- `ALLOWED_HOSTS=your-koyeb-service.koyeb.app`

Reference:
- [backend/.env.example](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/.env.example)

## Frontend Deployment

### Option A: Netlify

This repo includes a root [netlify.toml](file:///c:/Users/USER/Project/Kids-Bible_platform/netlify.toml) that:

- builds from `frontend/`
- runs `npm run build`
- publishes `frontend/dist`
- rewrites all SPA paths to `index.html`

The frontend also keeps the SPA redirect file:
- [frontend/public/_redirects](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/public/_redirects)

Netlify steps:

1. Connect the GitHub repository.
2. Confirm the build settings from `netlify.toml`.
3. Set `VITE_API_BASE_URL`.
4. Deploy.

### Option B: Vercel

This repo includes a root [vercel.json](file:///c:/Users/USER/Project/Kids-Bible_platform/vercel.json) that:

- builds the frontend from the monorepo root
- outputs `frontend/dist`
- rewrites SPA routes to `index.html`

Vercel steps:

1. Import the repository.
2. Confirm the custom build behavior from `vercel.json`.
3. Set `VITE_API_BASE_URL`.
4. Deploy.

## Backend Deployment on Koyeb

The backend is already container-ready via:
- [backend/Dockerfile](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/Dockerfile)

Recommended Koyeb setup:

1. Create a new Web Service from the GitHub repository or from the backend Docker image.
2. Point the service at the `backend/` directory if using repo-based Docker build.
3. Use the existing Docker startup command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

4. Set all backend environment variables.
5. Configure an HTTP health check to:

```text
/health
```

6. Deploy and verify:
- `https://your-koyeb-service.koyeb.app/health`
- `https://your-koyeb-service.koyeb.app/api/docs`

## PostgreSQL on Oracle Cloud Always Free

The application stays on PostgreSQL. Oracle Cloud is only the host infrastructure.

### Recommended VM Flow

1. Create an Always Free VM.
2. Assign a public IP.
3. Open the PostgreSQL port only if you must, and restrict ingress as much as possible.
4. Install PostgreSQL directly on the VM or run it in Docker.
5. Create:
- a database, for example `kids_bible_db`
- an application user, for example `kids_user`
- a strong password
6. Update PostgreSQL config so the Koyeb backend can connect.
7. Use the resulting connection string as `DATABASE_URL`.

### Migration Flow

After the Koyeb service is configured with the right `DATABASE_URL`, run:

```bash
alembic upgrade head
```

You can do this from a one-off shell in the backend environment or from a trusted machine with the same environment values set.

## Local Development

Local development still uses the existing Docker/local setup:

```bash
docker-compose up -d
docker-compose exec backend alembic upgrade head
```

This remains the easiest local path even though production is split.

## Verification Checklist

- Frontend build succeeds
- Frontend nested routes work after deployment
- Backend responds on `/health`
- Backend CORS accepts the deployed frontend origin
- Backend connects to Oracle-hosted PostgreSQL
- Migrations run successfully
- Login flow works end to end
- Lesson loading works end to end
- Quiz submission works end to end

## Notes

- `deploy/aws-free-tier.md` is now a legacy alternative, not the recommended path.
- The recommended free-tier path for this repo is Netlify/Vercel + Koyeb + PostgreSQL on Oracle Cloud infrastructure.
