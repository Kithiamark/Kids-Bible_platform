# Backend Models (SQLAlchemy)

Models are SQLAlchemy ORM classes defining the DB schema and relationships.

Folder: [backend/app/models/](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/)

The backend ensures model metadata is registered at boot by importing models in:
- [models/__init__.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/__init__.py)

## Core Models and Relationships

### User

File: [models/user.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/user.py)

Represents admin/teacher/parent accounts and owns:
- Student profiles (as parent)
- Lessons/quizzes created (as admin/teacher)
- Messages authored (as staff)

Key related concepts:
- `UserRole` enum: [models/user.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/user.py#L9-L14)

### Student

File: [models/student.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/student.py)

Represents child identity:
- Linked to a parent (`parent_id`)
- Has `age_group`, `current_level`, `total_points`

Key related concepts:
- `AgeGroup` enum: [models/student.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/student.py#L9-L14)

### Lesson + LessonMedia

File: [models/lesson.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/lesson.py)

Represents learning content:
- `Lesson` holds title/description/content, `age_group`, `order_index`, `is_published`
- `LessonMedia` holds external media attachments (YouTube/Spotify/etc)

Enums:
- `MediaType`: [models/lesson.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/lesson.py#L10-L14)

### StudentProgress

File: [models/progress.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/progress.py)

Represents per-student lesson progress:
- started/completed flags
- completion percentage
- time spent

### Quiz Domain

File: [models/quiz.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/quiz.py)

Core entities:
- `Quiz`: per-lesson quiz container (`passing_score`, `max_attempts`, `is_active`)
- `Question`: multiple question types (MCQ, true/false, image-based)
- `QuizAttempt`: a student’s attempt at a quiz (attempt number, score, completion timestamps)
- `Answer`: per-question answer record for an attempt

Enums:
- `QuestionType`: [models/quiz.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/quiz.py#L9-L13)

### Groups + Membership

File: [models/group.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/group.py)

Represents chat/learning groups:
- `Group` is the container
- `GroupMembership` links students/users to groups

Enum:
- `GroupType`: [models/group.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/group.py#L10-L15)

### Messages

File: [models/chat.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/chat.py)

Represents messages in groups:
- Sender can be a user or student (depending on endpoint path)
- Moderation fields enable staff moderation and parent monitoring

Enum:
- `MessageType`: [models/chat.py](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/chat.py#L9-L13)

## Enum Persistence Pattern

The repo includes a helper for storing enums by their `.value` strings:
- [value_enum](file:///c:/Users/USER/Project/Kids-Bible_platform/backend/app/models/types.py#L4-L10)

