# Backend API Layer (FastAPI Routers)

API endpoints live under [backend/app/api/v1/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/). All are mounted under:

- `/api/v1/...` via [main.py include_router](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/main.py#L60-L62)

The v1 router aggregator:
- [api/v1/__init__.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/__init__.py)

## Router Map and Responsibilities

### Authentication

File: [api/v1/auth.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/auth.py)

Responsibilities:
- Register users (parents/teachers)
- Login users (admin/teacher/parent)
- Login students (username + parent email)
- Refresh tokens

Depends on:
- [AuthService](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/auth_service.py)
- Token helpers in [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L29-L54)

### Users

File: [api/v1/users.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/users.py)

Responsibilities:
- Current user profile (`/users/me`)
- Admin/teacher user management
- Teachers list

Depends on:
- Role guards in [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L143-L148)
- `User` model: [models/user.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/user.py)

### Students

File: [api/v1/students.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/students.py)

Responsibilities:
- Student CRUD
- Parent “my students”
- Student self profile (`/students/me`)
- Student peer listing (age group peers)

Depends on:
- Auth dependencies: [get_current_student](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L150-L171) and [require_parent/require_teacher](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L143-L148)
- Progress aggregation in [ProgressService](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/progress_service.py)

### Lessons

File: [api/v1/lessons.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/lessons.py)

Responsibilities:
- Staff CRUD for lessons
- Student lesson listing with progress overlay
- Student lesson access enforcement (published + age group match)

Depends on:
- Models: [Lesson](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/lesson.py), [StudentProgress](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/progress.py)
- Student auth: [get_current_student](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L150-L171)

### Quizzes

File: [api/v1/quizzes.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/quizzes.py)

Responsibilities:
- Staff quiz CRUD
- Student quiz views (without answers)
- Attempt start/submit
- Attempts listing

Depends on:
- [QuizService](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py)
- Student auth: [get_current_student](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L150-L171)

### Progress

File: [api/v1/progress.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/progress.py)

Responsibilities:
- Start/update lesson progress
- Student dashboard stats
- Parent dashboard aggregated stats

Depends on:
- [ProgressService](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/progress_service.py)
- Student auth and parent auth guards in [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py#L143-L171)

### Groups

File: [api/v1/groups.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/groups.py)

Responsibilities:
- Group CRUD
- Membership management
- Direct chats (student-to-student and user-to-user)

Depends on:
- Group models: [models/group.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/group.py)
- Chat schemas: [schemas/chat.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/chat.py)

### Chat

File: [api/v1/chat.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/chat.py)

Responsibilities:
- Post and list messages for groups
- Parent monitoring controls (read-only paths)
- Moderation actions (flag/update moderation state; list flagged)

Depends on:
- Chat models: [models/chat.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/chat.py)
- Group membership checks: [models/group.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/group.py)

## Quick “Where should I add a new endpoint?”

- Create a new module under [api/v1/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/) (or extend an existing one).
- Add schemas under [schemas/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/) for request/response.
- If the endpoint is more than simple CRUD, add a `Service` function under [services/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/).
- Mount the router in [api/v1/__init__.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/__init__.py).

