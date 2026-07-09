# Kids Delight Learning Platform

A production-ready web application for children's Bible education with separate Admin/Teacher and Student experiences.

## 🎯 Features

### Core Functionality
- **Multi-Role Authentication**: Admin, Teacher, Parent, and Student roles with JWT-based auth
- **Age-Grouped Learning**: Separate content for Toddlers, Ages 4-9, Ages 10-12, and Teens
- **Interactive Lessons**: Rich content with text, podcasts (Spotify), and YouTube videos
- **Quiz System**: Auto-graded quizzes with multiple choice, true/false, and image-based questions
- **Progress Tracking**: Real-time progress monitoring with level system and points
- **Chat & Groups**: Moderated group discussions for collaborative learning
- **Parent Dashboard**: Monitor multiple children's progress

### Security
- TLS/HTTPS for all communications
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Input validation and sanitization
- Cloud-provider or disk-level encryption at rest when configured

##  Architecture

### Backend (Python/FastAPI)
```
backend/
├── app/
│   ├── api/v1/           # API endpoints
│   ├── core/             # Config, database, security
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   └── services/         # Business logic
├── alembic/              # Database migrations
├── tests/                # Unit & integration tests
└── requirements.txt      # Python dependencies
```

### Frontend (React/TypeScript)
```
frontend/
├── src/
│   ├── components/       # Reusable components
│   ├── layouts/          # Admin & Student layouts
│   ├── pages/            # Page components
│   ├── lib/              # API client & utilities
│   └── store/            # Zustand state management
├── public/               # Static assets
└── package.json          # Node dependencies
```

### Database Schema

#### Users & Students
- **users**: Admin, Teacher, Parent accounts
- **students**: Child profiles linked to parents
- **Age groups**: Toddlers, Ages 4-9, Ages 10-12, Teens

#### Content
- **lessons**: Bible lessons with rich content
- **lesson_media**: Podcast and video attachments
- **quizzes**: Quizzes attached to lessons
- **questions**: Quiz questions with auto-grading

#### Progress & Engagement
- **student_progress**: Lesson completion tracking
- **quiz_attempts**: Quiz submissions with scores
- **groups**: Learning groups by age/class
- **messages**: Moderated group chat

##  Getting Started

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 16+
- Docker & Docker Compose (optional)

### Local Development

#### 1. Clone the repository
```bash
git clone <repository-url>
cd kids-bible-platform
```

#### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn app.main:app --reload
```

Backend will run on `http://localhost:8000`
API docs available at `http://localhost:8000/api/docs`

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with API URL

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### Docker Deployment

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your settings

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend alembic upgrade head

# View logs
docker-compose logs -f
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Database: `localhost:5432`

### Recommended Free Hosting Deployment

See [DEPLOYMENT.md](file:///c:/Users/USER/Project/Kids-Bible_platform/DEPLOYMENT.md) for the recommended split deployment:

- Frontend on Netlify or Vercel
- Backend on Koyeb
- PostgreSQL hosted on Oracle Cloud Always Free infrastructure

##  Testing

### Backend Tests
```bash
cd backend

# Run all tests with coverage
pytest

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v

# Generate coverage report
pytest --cov=app --cov-report=html
```

### Frontend Tests
```bash
cd frontend

# Run tests
npm test

# Run with coverage
npm run test:coverage
```


## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Database**: Use strong passwords and SSL connections
3. **Secrets**: Rotate JWT secret keys regularly
4. **HTTPS**: Always use TLS in production
5. **CORS**: Configure allowed origins strictly
6. **Input Validation**: All inputs validated via Pydantic
7. **SQL Injection**: SQLAlchemy ORM prevents SQL injection
8. **XSS Protection**: React automatically escapes content

##  Monitoring

### Health Checks
- Backend: `GET /health`
- Frontend: Served by nginx

### Logging
```python
# Backend uses Python logging
import logging
logger = logging.getLogger(__name__)
```

### Metrics (Optional)
Consider adding:
- Sentry for error tracking
- Prometheus for metrics

##  UI/UX Features

### Teal-Based Color Scheme
- Primary: Teal (#14b8a6)
- Gradients for student interface
- Calm, friendly, kid-safe design

### Responsive Design
- Mobile-first approach
- Works on tablets and desktops
- Smooth animations with Framer Motion

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader friendly

## 🔄 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/student-login` - Student login
- `POST /api/v1/auth/refresh` - Refresh token

### Lessons
- `GET /api/v1/lessons` - List lessons
- `POST /api/v1/lessons` - Create lesson (admin/teacher)
- `GET /api/v1/lessons/{id}` - Get lesson details
- `PUT /api/v1/lessons/{id}` - Update lesson
- `DELETE /api/v1/lessons/{id}` - Delete lesson

### Quizzes
- `POST /api/v1/quizzes` - Create quiz
- `POST /api/v1/quizzes/{id}/start` - Start quiz attempt
- `POST /api/v1/quizzes/attempts/{id}/submit` - Submit quiz

### Progress
- `POST /api/v1/progress/lessons/{id}/start` - Start lesson
- `PUT /api/v1/progress/lessons/{id}` - Update progress
- `GET /api/v1/progress/dashboard` - Get dashboard stats


## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 🙏 Acknowledgments

- FastAPI for the excellent web framework
- React team for the UI library
- PostgreSQL for robust database
- Netlify, Vercel, Koyeb, and Oracle Cloud for free-tier-friendly hosting
