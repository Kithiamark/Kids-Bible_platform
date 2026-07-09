# Backend Core Modules

Core modules provide shared infrastructure used by nearly every endpoint.

Folder: [backend/app/core/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/)

## Configuration: `Settings`

File: [core/config.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/config.py)

Responsibilities:
- Centralize all environment-driven settings (app name, debug, API version, security, DB, CORS).
- Provide defaults for development.
- Enforce safety checks when `environment == "production"`.

Key class:
- [Settings](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/config.py#L6-L45)

Production validation:
- Rejects weak/default `SECRET_KEY` and default sqlite DB in prod:
  - [validate_production_settings](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/config.py#L37-L45)

## Database: SQLAlchemy engine/session and `get_db`

File: [core/database.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/database.py)

Responsibilities:
- Create SQLAlchemy engine from `settings.database_url`.
- Provide request-scoped DB session dependency for FastAPI.

Key items:
- Engine/session/Base: [database.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/database.py#L1-L28)
- FastAPI dependency generator: [get_db](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/database.py#L30-L36)

## Security: Password hashing, JWT, and Role Guards

File: [core/security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py)

Responsibilities:
- Password hashing and verification using Argon2 (passlib).
- JWT access and refresh token creation and decoding.
- Auth dependencies for “User” vs “Student”.
- Role-based access control for endpoints.

### Password Functions

- Verify: [verify_password](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L19-L21)
- Hash: [get_password_hash](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L24-L26)

### Token Functions

- Access token: [create_access_token](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L29-L42)
- Refresh token: [create_refresh_token](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L45-L54)
- Decode/validate: [decode_token](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L57-L69)

### Auth Dependencies

- Current user:
  - [get_current_user](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L71-L117)
  - Notable behavior: rejects tokens with `student_id` or role `student`.
- Current student:
  - [get_current_student](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L150-L171)
  - Notable behavior: requires `student_id` in token payload.

### Role Guards

Role guard implementation:
- [RoleChecker](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L128-L141)

Commonly used instances:
- [require_admin / require_teacher / require_parent](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L143-L148)

