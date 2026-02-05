# API Documentation

Base URL: `http://localhost:8000/api/v1` (development)

All endpoints require authentication unless specified. Include JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Authentication

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "role": "parent" // or "teacher"
}

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "parent",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Login (Parent/Teacher/Admin)
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Student Login
```http
POST /auth/student-login
Content-Type: application/json

{
  "username": "johnny",
  "parent_email": "parent@example.com"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

## Users

### Get Current User
```http
GET /users/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "parent",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Update Current User
```http
PUT /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "John Smith",
  "email": "newmail@example.com"
}

Response: 200 OK
{
  "id": 1,
  "email": "newmail@example.com",
  "full_name": "John Smith",
  "role": "parent",
  "is_active": true
}
```

### List All Users (Admin Only)
```http
GET /users?skip=0&limit=100
Authorization: Bearer <admin_token>

Response: 200 OK
[
  {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "parent",
    "is_active": true
  },
  ...
]
```

## Students

### Create Student Profile
```http
POST /students
Authorization: Bearer <token>
Content-Type: application/json

{
  "parent_id": 1,
  "username": "johnny",
  "display_name": "Johnny",
  "age_group": "ages_4_9",
  "avatar_url": "https://..."
}

Response: 200 OK
{
  "id": 1,
  "parent_id": 1,
  "username": "johnny",
  "display_name": "Johnny",
  "age_group": "ages_4_9",
  "avatar_url": "https://...",
  "current_level": 1,
  "total_points": 0,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Get My Students
```http
GET /students/my-students
Authorization: Bearer <parent_token>

Response: 200 OK
[
  {
    "id": 1,
    "username": "johnny",
    "display_name": "Johnny",
    "age_group": "ages_4_9",
    "current_level": 5,
    "total_points": 1250
  },
  ...
]
```

### Get Current Student Profile
```http
GET /students/me
Authorization: Bearer <student_token>

Response: 200 OK
{
  "id": 1,
  "username": "johnny",
  "display_name": "Johnny",
  "age_group": "ages_4_9",
  "current_level": 5,
  "total_points": 1250,
  "lessons_completed": 12,
  "lessons_in_progress": 3,
  "average_quiz_score": 87.5,
  "total_time_spent_minutes": 450
}
```

## Lessons

### Create Lesson (Teacher/Admin)
```http
POST /lessons
Authorization: Bearer <teacher_token>
Content-Type: application/json

{
  "title": "Noah's Ark",
  "description": "The story of Noah and the great flood",
  "content": "<p>Full lesson content in HTML...</p>",
  "age_group": "ages_4_9",
  "order_index": 1,
  "is_published": true,
  "thumbnail_url": "https://...",
  "media_items": [
    {
      "media_type": "video",
      "title": "Noah's Ark Animated",
      "url": "https://youtube.com/watch?v=...",
      "thumbnail_url": "https://...",
      "order_index": 1
    },
    {
      "media_type": "podcast",
      "title": "Noah's Ark Story Audio",
      "url": "https://spotify.com/episode/...",
      "duration": 300,
      "order_index": 2
    }
  ]
}

Response: 200 OK
{
  "id": 1,
  "title": "Noah's Ark",
  "description": "The story of Noah and the great flood",
  "content": "<p>Full lesson content in HTML...</p>",
  "age_group": "ages_4_9",
  "order_index": 1,
  "is_published": true,
  "media_items": [...],
  "created_by": 1,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### List Lessons
```http
GET /lessons?age_group=ages_4_9&published_only=true&skip=0&limit=20
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "title": "Noah's Ark",
    "description": "The story of Noah...",
    "age_group": "ages_4_9",
    "order_index": 1,
    "is_published": true,
    "thumbnail_url": "https://...",
    "media_items": [...]
  },
  ...
]
```

### Get Student Lessons with Progress
```http
GET /lessons/student
Authorization: Bearer <student_token>

Response: 200 OK
[
  {
    "id": 1,
    "title": "Noah's Ark",
    "description": "The story of Noah...",
    "is_started": true,
    "is_completed": false,
    "completion_percentage": 45.0,
    "media_items": [...]
  },
  ...
]
```

### Get Lesson by ID
```http
GET /lessons/1
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "title": "Noah's Ark",
  "description": "The story of Noah...",
  "content": "<p>Full lesson content...</p>",
  "age_group": "ages_4_9",
  "is_published": true,
  "media_items": [
    {
      "id": 1,
      "media_type": "video",
      "title": "Noah's Ark Animated",
      "url": "https://youtube.com/watch?v=...",
      "thumbnail_url": "https://...",
      "order_index": 1
    }
  ],
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Quizzes

### Create Quiz (Teacher/Admin)
```http
POST /quizzes
Authorization: Bearer <teacher_token>
Content-Type: application/json

{
  "lesson_id": 1,
  "title": "Noah's Ark Quiz",
  "description": "Test your knowledge!",
  "passing_score": 70.0,
  "max_attempts": 3,
  "is_active": true,
  "questions": [
    {
      "question_type": "multiple_choice",
      "question_text": "How many of each animal did Noah take?",
      "options": [
        {"id": "a", "text": "One"},
        {"id": "b", "text": "Two"},
        {"id": "c", "text": "Three"}
      ],
      "correct_answer": "b",
      "points": 10,
      "order_index": 1,
      "explanation": "Noah took two of every animal!"
    },
    {
      "question_type": "true_false",
      "question_text": "It rained for 40 days and 40 nights",
      "options": [
        {"id": "true", "text": "True"},
        {"id": "false", "text": "False"}
      ],
      "correct_answer": "true",
      "points": 10,
      "order_index": 2
    }
  ]
}

Response: 200 OK
{
  "id": 1,
  "lesson_id": 1,
  "title": "Noah's Ark Quiz",
  "passing_score": 70.0,
  "max_attempts": 3,
  "is_active": true,
  "questions": [...],
  "created_by": 1,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Start Quiz Attempt
```http
POST /quizzes/1/start
Authorization: Bearer <student_token>

Response: 200 OK
{
  "id": 1,
  "quiz_id": 1,
  "student_id": 1,
  "attempt_number": 1,
  "is_completed": false,
  "started_at": "2024-01-01T10:00:00Z"
}
```

### Submit Quiz
```http
POST /quizzes/attempts/1/submit
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "quiz_id": 1,
  "answers": [
    {
      "question_id": 1,
      "selected_answer": "b"
    },
    {
      "question_id": 2,
      "selected_answer": "true"
    }
  ]
}

Response: 200 OK
{
  "id": 1,
  "quiz_id": 1,
  "student_id": 1,
  "attempt_number": 1,
  "score": 100.0,
  "total_points": 20,
  "max_points": 20,
  "is_passed": true,
  "is_completed": true,
  "completed_at": "2024-01-01T10:15:00Z",
  "answers": [
    {
      "question_id": 1,
      "selected_answer": "b",
      "is_correct": true,
      "correct_answer": "b",
      "points_earned": 10,
      "explanation": "Noah took two of every animal!"
    },
    {
      "question_id": 2,
      "selected_answer": "true",
      "is_correct": true,
      "correct_answer": "true",
      "points_earned": 10
    }
  ]
}
```

## Progress Tracking

### Start Lesson
```http
POST /progress/lessons/1/start
Authorization: Bearer <student_token>

Response: 200 OK
{
  "id": 1,
  "student_id": 1,
  "lesson_id": 1,
  "is_started": true,
  "is_completed": false,
  "completion_percentage": 0.0,
  "started_at": "2024-01-01T10:00:00Z",
  "last_accessed_at": "2024-01-01T10:00:00Z"
}
```

### Update Progress
```http
PUT /progress/lessons/1
Authorization: Bearer <student_token>
Content-Type: application/json

{
  "completion_percentage": 50.0,
  "time_spent_minutes": 15
}

Response: 200 OK
{
  "id": 1,
  "student_id": 1,
  "lesson_id": 1,
  "is_started": true,
  "is_completed": false,
  "completion_percentage": 50.0,
  "time_spent_minutes": 15,
  "last_accessed_at": "2024-01-01T10:15:00Z"
}
```

### Get Dashboard Stats
```http
GET /progress/dashboard
Authorization: Bearer <student_token>

Response: 200 OK
{
  "total_lessons": 20,
  "lessons_completed": 12,
  "lessons_in_progress": 3,
  "current_level": 5,
  "total_points": 1250,
  "average_quiz_score": 87.5,
  "total_time_spent_minutes": 450,
  "recent_achievements": [
    "First Lesson Completed!",
    "10 Lessons Mastered!",
    "Quiz Master!"
  ]
}
```

## Chat & Groups

### Create Group (Teacher/Admin)
```http
POST /groups
Authorization: Bearer <teacher_token>
Content-Type: application/json

{
  "name": "Ages 4-9 Study Group",
  "description": "Group discussion for ages 4-9",
  "group_type": "age_group",
  "age_group": "ages_4_9",
  "is_active": true
}

Response: 200 OK
{
  "id": 1,
  "name": "Ages 4-9 Study Group",
  "description": "Group discussion for ages 4-9",
  "group_type": "age_group",
  "age_group": "ages_4_9",
  "is_active": true,
  "created_by": 1,
  "member_count": 0,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Send Message
```http
POST /chat/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "group_id": 1,
  "content": "Hello everyone!",
  "message_type": "text"
}

Response: 200 OK
{
  "id": 1,
  "group_id": 1,
  "sender_id": 1,
  "content": "Hello everyone!",
  "message_type": "text",
  "is_moderated": false,
  "is_flagged": false,
  "created_at": "2024-01-01T10:00:00Z",
  "sender_name": "John Doe"
}
```

### Get Group Messages
```http
GET /chat/groups/1/messages?skip=0&limit=50
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": 1,
    "group_id": 1,
    "sender_id": 1,
    "content": "Hello everyone!",
    "message_type": "text",
    "is_flagged": false,
    "created_at": "2024-01-01T10:00:00Z",
    "sender_name": "John Doe"
  },
  ...
]
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Rate Limiting

*To be implemented in future version*

## Pagination

Most list endpoints support pagination:
- `skip`: Number of items to skip (default: 0)
- `limit`: Maximum number of items to return (default: 20, max: 100)

## Interactive API Documentation

Visit the interactive API docs at:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`
