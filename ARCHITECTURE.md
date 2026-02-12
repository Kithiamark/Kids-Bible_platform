# System Architecture

## Overview

The Kids Delight Learning Platform is a full-stack web application built with a modern, scalable architecture.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React App (TypeScript)                              │   │
│  │  - React Router (routing)                            │   │
│  │  - Zustand (state management)                        │   │
│  │  - TanStack Query (data fetching)                    │   │
│  │  - Tailwind CSS (styling)                            │   │
│  │  - Framer Motion (animations)                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FastAPI (Python)                                    │   │
│  │  - JWT Authentication                                │   │
│  │  - Role-Based Access Control                         │   │
│  │  - Pydantic Validation                              │   │
│  │  - OpenAPI Documentation                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services                                            │   │
│  │  - AuthService (authentication)                      │   │
│  │  - QuizService (auto-grading)                        │   │
│  │  - ProgressService (tracking & levels)               │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Data Access Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SQLAlchemy ORM                                      │   │
│  │  - Models                                            │   │
│  │  - Relationships                                     │   │
│  │  - Migrations (Alembic)                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Azure PostgreSQL                                    │   │
│  │  - ACID compliance                                   │   │
│  │  - Backup & recovery                                 │   │
│  │  - Encryption at rest                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  - Azure Blob Storage (media files)                  │   │
│  │  - Spotify (podcast embeds)                          │   │
│  │  - YouTube (video embeds)                            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Architecture

#### Technology Stack
- **React 19**: UI library
- **TypeScript**: Type safety
- **React Router**: Client-side routing
- **Zustand**: Lightweight state management
- **TanStack Query**: Server state management
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Animations

#### Key Features
1. **Authentication Flow**
   - Login page for Parents/Teachers/Admin
   - Separate student login with username + parent email
   - JWT token management with automatic refresh
   - Protected routes based on user role

2. **Admin Dashboard**
   - Lesson management (CRUD operations)
   - Quiz creation and management
   - User management
   - Group management
   - Analytics and statistics

3. **Student Interface**
   - Personalized dashboard with progress
   - Lesson catalog with media players
   - Interactive quizzes
   - Progress tracking visualization
   - Group chat

### Backend Architecture

#### Technology Stack
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **Alembic**: Database migrations
- **Pydantic**: Data validation
- **python-jose**: JWT handling
- **passlib**: Password hashing
- **pytest**: Testing framework

#### API Structure
```
/api/v1/
├── auth/           # Authentication endpoints
├── users/          # User management
├── students/       # Student profiles
├── lessons/        # Lesson CRUD
├── quizzes/        # Quiz system
├── progress/       # Progress tracking
├── chat/           # Messaging
└── groups/         # Group management
```

#### Security Layers
1. **Authentication**: JWT with refresh tokens
2. **Authorization**: Role-based access control
3. **Input Validation**: Pydantic schemas
4. **Password Hashing**: argon2-cffi
5. **CORS**: Configurable origins
6. **Rate Limiting**: (Future enhancement)

### Database Schema

#### Core Entities

**Users Table**
```sql
users
├── id (PK)
├── email (unique)
├── hashed_password
├── full_name
├── role (admin/teacher/parent/student)
├── is_active
└── timestamps
```

**Students Table**
```sql
students
├── id (PK)
├── parent_id (FK -> users)
├── username (unique)
├── display_name
├── age_group (enum)
├── avatar_url
├── current_level
├── total_points
└── timestamps
```

**Lessons Table**
```sql
lessons
├── id (PK)
├── title
├── description
├── content (rich text)
├── age_group (enum)
├── order_index
├── is_published
├── thumbnail_url
├── created_by (FK -> users)
└── timestamps
```

**Quizzes & Questions**
```sql
quizzes
├── id (PK)
├── lesson_id (FK -> lessons)
├── title
├── passing_score
├── max_attempts
├── created_by (FK -> users)
└── timestamps

questions
├── id (PK)
├── quiz_id (FK -> quizzes)
├── question_type (enum)
├── question_text
├── options (JSON)
├── correct_answer
├── points
└── order_index
```

#### Progress Tracking

**Student Progress**
```sql
student_progress
├── id (PK)
├── student_id (FK -> students)
├── lesson_id (FK -> lessons)
├── is_started
├── is_completed
├── completion_percentage
├── time_spent_minutes
└── timestamps
```

**Quiz Attempts**
```sql
quiz_attempts
├── id (PK)
├── quiz_id (FK -> quizzes)
├── student_id (FK -> students)
├── attempt_number
├── score (percentage)
├── is_passed
├── is_completed
└── timestamps
```

## Data Flow

### Authentication Flow
```
1. User submits credentials
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT access + refresh tokens
   ↓
4. Store tokens in client localStorage
   ↓
5. Include token in Authorization header
   ↓
6. Backend validates token on each request
   ↓
7. Auto-refresh on token expiry
```

### Quiz Auto-Grading Flow
```
1. Student starts quiz attempt
   ↓
2. Questions loaded (without answers)
   ↓
3. Student submits answers
   ↓
4. Backend compares with correct answers
   ↓
5. Calculate score and points
   ↓
6. Update student total points
   ↓
7. Return graded results with explanations
```

### Progress Tracking Flow
```
1. Student opens lesson
   ↓
2. Create progress record (is_started)
   ↓
3. Track time spent and completion %
   ↓
4. Mark lesson complete at 100%
   ↓
5. Award completion points
   ↓
6. Recalculate student level
   ↓
7. Update dashboard statistics
```

## Deployment Architecture

### Docker Containers
```
┌─────────────────┐
│   Nginx (80)    │  → Frontend static files
└─────────────────┘

┌─────────────────┐
│  FastAPI (8000) │  → Backend API
└─────────────────┘

┌─────────────────┐
│ PostgreSQL      │  → Database
│   (5432)        │
└─────────────────┘

┌─────────────────┐
│ Redis (6379)    │  → Caching (optional)
└─────────────────┘
```

### Azure Infrastructure
```
Azure Front Door (CDN)
       ↓
Azure Load Balancer
       ↓
┌─────────────────────────┐
│ Container Apps          │
│ - Frontend (nginx)      │
│ - Backend (FastAPI)     │
└─────────────────────────┘
       ↓
Azure Database for PostgreSQL
       ↓
Azure Blob Storage (media)
```

## Performance Considerations

### Backend
- **Database Connection Pooling**: SQLAlchemy pool
- **Query Optimization**: Eager loading for relationships
- **Caching**: Redis for frequently accessed data
- **Async Operations**: FastAPI async endpoints

### Frontend
- **Code Splitting**: React lazy loading
- **Image Optimization**: Compressed thumbnails
- **State Management**: Zustand for minimal re-renders
- **Data Caching**: TanStack Query

## Scalability

### Horizontal Scaling
- Stateless backend API (can run multiple instances)
- Load balancer distributes traffic
- Database connection pooling

### Vertical Scaling
- Increase container resources as needed
- Azure Container Apps auto-scaling

## Security Architecture

### Defense in Depth
1. **Network**: HTTPS/TLS encryption
2. **Application**: JWT authentication, RBAC
3. **Database**: Encrypted connections, encrypted at rest
4. **Code**: Input validation, SQL injection prevention
5. **Infrastructure**: Azure security features

### Authentication & Authorization
```
Request
  ↓
JWT Token Validation
  ↓
Extract User/Role
  ↓
Permission Check
  ↓
Execute Business Logic
  ↓
Response
```

## Monitoring & Logging

### Application Logging
- Python logging module
- Structured JSON logs
- Log levels: DEBUG, INFO, WARNING, ERROR

### Health Checks
- `/health` endpoint
- Database connectivity check
- Container health checks

### Metrics (Future)
- Request latency
- Error rates
- Active users
- Database query performance

## Future Enhancements

1. **WebSocket Support**: Real-time chat
2. **Push Notifications**: Progress reminders
3. **CDN Integration**: Faster media delivery
4. **Advanced Analytics**: Detailed reporting
5. **Mobile Apps**: React Native
6. **API Rate Limiting**: Prevent abuse
7. **Full-Text Search**: Elasticsearch
8. **Automated Backups**: Daily snapshots
