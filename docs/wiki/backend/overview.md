# Backend Overview (FastAPI)

Backend code lives under [backend/app/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/). It is structured in a typical FastAPI layering:

- `main.py`: app bootstrap, middleware, router mounting
- `api/v1/`: HTTP endpoints (FastAPI routers)
- `core/`: cross-cutting concerns (settings, DB session, security)
- `models/`: SQLAlchemy ORM models (DB schema + relationships)
- `schemas/`: Pydantic schemas (request/response DTOs)
- `services/`: business logic and complex workflows

## Bootstrapping

- FastAPI app creation: [backend/app/main.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/main.py#L19-L64)
- v1 router mounted under `/api/v1`: [include_router call](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/main.py#L60-L62)
- OpenAPI docs endpoints are configured in FastAPI constructor:
  - `/api/docs`, `/api/redoc`, `/api/openapi.json` ([main.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/main.py#L19-L26))

## Major Modules and Responsibilities

### core/

- Configuration settings, env validation, defaults:
  - [core/config.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/config.py#L6-L48)
- DB engine/session + FastAPI `Depends` provider:
  - [core/database.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/database.py#L1-L36)
- Auth, password hashing, JWT, and RBAC:
  - [core/security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L19-L171)

### api/v1/

API modules are grouped by domain, each exposing a FastAPI `router`:

- Auth: [api/v1/auth.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/auth.py)
- Users: [api/v1/users.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/users.py)
- Students: [api/v1/students.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/students.py)
- Lessons: [api/v1/lessons.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/lessons.py)
- Quizzes: [api/v1/quizzes.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/quizzes.py)
- Progress: [api/v1/progress.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/progress.py)
- Groups: [api/v1/groups.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/groups.py)
- Chat: [api/v1/chat.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/chat.py)

Router aggregation:
- [api/v1/__init__.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/__init__.py)

### services/

Services encapsulate multi-step flows that touch multiple tables:

- Auth workflows: [AuthService](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/auth_service.py)
- Quiz attempt lifecycle + grading: [QuizService](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py)
- Progress/levels/dashboards: [ProgressService](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/progress_service.py)

## Key “Identity Types”

This backend treats “User” and “Student” differently:

- `User`: admin/teacher/parent accounts (staff and guardians)
  - Model: [models/user.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/user.py)
  - Access pattern: [get_current_user](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L71-L117)
- `Student`: child identity, authenticates via special student login, uses `student_id` in JWT
  - Model: [models/student.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/student.py)
  - Access pattern: [get_current_student](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L150-L171)

