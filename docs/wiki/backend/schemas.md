# Backend Schemas (Pydantic DTOs)

Schemas are the contract for request bodies and response shapes. They live under:

- [backend/app/schemas/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/)

They are used by API routers in [api/v1/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/api/v1/) to:
- Validate inbound JSON
- Serialize outbound ORM objects (or computed values) into stable shapes

The schema package also has an export aggregator:
- [schemas/__init__.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/__init__.py)

## Auth Schemas

File: [schemas/auth.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/auth.py)

Key DTOs:
- Token response shape: `Token`
- Login requests: `LoginRequest`, `StudentLoginRequest`

## User Schemas

File: [schemas/user.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/user.py)

Key DTOs:
- `UserCreate`: used by registration or admin creation
- `UserUpdate`: used by profile updates
- `UserResponse`: typical user response shape

## Student Schemas

File: [schemas/student.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/student.py)

Key DTOs:
- `StudentCreate`: creating a child profile
- `StudentResponse`: core student profile shape
- `StudentWithProgress`: student + aggregated progress fields

## Lesson Schemas

File: [schemas/lesson.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/lesson.py)

Key DTOs:
- `LessonCreate`, `LessonUpdate`, `LessonResponse`
- `LessonMediaCreate`, `LessonMediaResponse`
- `LessonWithProgress`: used when overlaying student progress onto lessons

## Quiz Schemas

File: [schemas/quiz.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/quiz.py)

Key DTOs:
- `QuizCreate`, `QuizUpdate`, `QuizResponse`
- `QuizStudentView`: student-safe view (typically excludes correct answers)
- Submission/grade contract:
  - `QuizSubmit`, `QuizAnswer`, `AnswerResult`, `QuizAttemptResponse`

## Progress Schemas

File: [schemas/progress.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/progress.py)

Key DTOs:
- `ProgressCreate`, `ProgressUpdate`, `ProgressResponse`
- Dashboard aggregates:
  - `StudentDashboardStats`, `ParentDashboardStats`

## Chat/Group Schemas

File: [schemas/chat.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/schemas/chat.py)

Key DTOs:
- Message: `MessageCreate`, `MessageResponse`, moderation DTOs
- Groups: `GroupCreate`, `GroupResponse`, membership DTOs
- Direct chat creation DTOs (student/user)

