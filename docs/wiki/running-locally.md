# Running the Project Locally

This page is a condensed, “code wiki” version of the setup steps, with pointers to the source of truth in the repo.

Primary references:
- [SETUP.md](file:///c:/Users/USER/Project/Kids-Bible_platform/SETUP.md)
- [README.md](file:///c:/Users/USER/Project/Kids-Bible_platform/README.md)

## Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 16+ (or use Docker)
- Docker + Docker Compose (recommended for local)

## Option A: Docker Compose (Recommended)

Files involved:
- Orchestration: [docker-compose.yml](file:///c:/Users/USER/Project/Kids-Bible_platform/docker-compose.yml)
- Backend image: [backend/Dockerfile](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/Dockerfile)
- Frontend image: [frontend/Dockerfile](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/Dockerfile)

### 1) Configure environment

- Copy the root env template and adjust as needed:
  - [.env.example](file:///c:/Users/USER/Project/Kids-Bible_platform/.env.example)

For backend-only env template, also see:
- [backend/.env.example](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/.env.example)

### 2) Start stack

```bash
docker-compose up -d --build
```

### 3) Run DB migrations

```bash
docker-compose exec backend alembic upgrade head
```

### 4) Create an admin user (optional, for a clean DB)

See the inline snippet in [SETUP.md](file:///c:/Users/USER/Project/Kids-Bible_platform/SETUP.md#L37-L54).

### 5) URLs

- Frontend: http://localhost:5173 (nginx container)
- Backend: http://localhost:8000
- API docs: http://localhost:8000/api/docs
- Health check: http://localhost:8000/health

## Option B: Manual (Non-Docker)

### Backend

Files involved:
- Dependencies: [backend/requirements.txt](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/requirements.txt)
- App entry: [backend/app/main.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/main.py)
- Settings: [backend/app/core/config.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/config.py)

```bash
cd backend

python -m venv venv
venv\Scripts\activate

pip install -r requirements.txt

copy .env.example .env

alembic upgrade head

uvicorn app.main:app --reload
```

Backend runs at http://localhost:8000.

### Frontend

Files involved:
- Dependencies/scripts: [frontend/package.json](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/package.json)
- App routes: [frontend/src/App.tsx](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/App.tsx)
- API client: [frontend/src/lib/api.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts)
- Auth state: [frontend/src/store/authStore.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts)

```bash
cd frontend
npm install

copy .env.example .env

npm run dev
```

Frontend runs at http://localhost:5173.

## Common Issues

### “Frontend can’t reach backend”

- Confirm backend health: http://localhost:8000/health
- Confirm frontend API base URL is correct:
  - `VITE_API_BASE_URL` used by [api.ts](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L3-L4)
- Confirm backend CORS settings (dev vs prod CORS differs):
  - [main.py CORS config](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/main.py#L29-L50)

### “401 Unauthorized”

- Login flows store tokens into localStorage:
  - [useAuthStore.setAuth](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/store/authStore.ts#L44-L53)
- Axios attaches the `Authorization` header automatically:
  - [api.ts request interceptor](file:///c:/Users/USER/Project/Kids-Bible_platform/frontend/src/lib/api.ts#L39-L45)

## Running Tests

Backend:

```bash
cd backend
pytest
```

Test suite location: [backend/tests/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/tests/)

