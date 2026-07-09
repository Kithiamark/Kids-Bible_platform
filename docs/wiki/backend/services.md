# Backend Services (Business Logic)

Services exist to keep API routers thin and to centralize multi-step workflows that:
- touch multiple tables
- need consistent rules (attempt limits, age-group checks, scoring)
- build aggregate stats for dashboards

Folder: [backend/app/services/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/)

## AuthService

File: [services/auth_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/auth_service.py)

Responsibilities:
- Register users (parents/teachers)
- Authenticate users by verifying credentials
- Authenticate students (username + parent email)
- Issue access + refresh tokens using [security.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/core/security.py)

Used by:
- [api/v1/auth.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/auth.py)

## QuizService

File: [services/quiz_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py)

Responsibilities:
- Create/update quizzes and questions
- Start quiz attempts with validation
- Submit attempts and auto-grade answers
- Persist answer records and attempt summary
- Award student points on passing submissions

Key functions:
- Create quiz: [create_quiz](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py#L15-L47)
- Update quiz: [update_quiz](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py#L49-L75)
- Attempt start with access + attempt-limit checks: [start_quiz_attempt](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py#L77-L123)
- Submit + grade:
  - grading loop + answer persistence: [submit_quiz](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py#L126-L177)
  - scoring + attempt finalization: [submit_quiz score update](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py#L178-L189)
  - points award: [submit_quiz student points](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/quiz_service.py#L190-L195)

Used by:
- [api/v1/quizzes.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/quizzes.py)

## ProgressService

File: [services/progress_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/progress_service.py)

Responsibilities:
- Create/update lesson progress records
- Compute level thresholds and update student level
- Build student dashboard stats (lessons completed, time spent, quiz averages, recent achievements)
- Build parent dashboard stats across multiple children

Used by:
- [api/v1/progress.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/progress.py)
- [api/v1/students.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/students.py) (progress overlays)

## user_service.py (Legacy/Unused)

File: [services/user_service.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/services/user_service.py)

Notes:
- This looks like a stub “fake users db” helper and is referenced by an alternate auth router under [api/auth/routes.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/auth/routes.py).
- The primary app mounts [api/v1/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/) (see [main.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/main.py#L60-L62)), so this module is typically not used in normal operation.

