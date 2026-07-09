# Setup Instructions

Quick guide to get the Kids Delight Learning Platform running locally.

## Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 16+ (or use Docker)
- Git

## Option 1: Docker Setup (Recommended)

The fastest way to get started:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd kids-bible-platform

# 2. Create environment file
cp .env.example .env

# 3. Edit .env and set at minimum:
# SECRET_KEY=your-random-secret-key-here
# DB_PASSWORD=your_secure_password

# 4. Start all services
docker-compose up -d

# 5. Wait for services to start (about 30 seconds)
docker-compose ps

# 6. Run database migrations
docker-compose exec backend alembic upgrade head

# 7. Create an admin user
docker-compose exec backend python -c "
from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

db = SessionLocal()
admin = User(
    email='admin@example.com',
    hashed_password=get_password_hash('admin123'),
    full_name='Admin User',
    role=UserRole.ADMIN,
    is_active=True
)
db.add(admin)
db.commit()
print('Admin user created!')
"

# 8. Access the application
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/api/docs"
echo ""
echo "Login credentials:"
echo "Email: admin@example.com"
echo "Password: admin123"
```

That's it! You're ready to go.

## Option 2: Manual Setup

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate virtual environment
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env

# 5. Edit .env and configure:
# - DATABASE_URL (PostgreSQL connection string)
# - SECRET_KEY (random secret key)
# - Other settings as needed

# 6. Set up PostgreSQL database
# Option A: Use local PostgreSQL
createdb kids_bible_db

# Option B: Use Docker for PostgreSQL only
docker run -d \
  --name postgres \
  -e POSTGRES_DB=kids_bible_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine

# 7. Run migrations
alembic upgrade head

# 8. Start the backend server
uvicorn app.main:app --reload

# Backend will be available at http://localhost:8000
```

### Frontend Setup

```bash
# 1. Open a new terminal and navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Edit .env
# VITE_API_BASE_URL=http://localhost:8000/api/v1

# 5. Start the development server
npm run dev

# Frontend will be available at http://localhost:5173
```

### Create Admin User (Manual)

```bash
# In backend directory with virtual environment activated
python

# Then in Python shell:
>>> from app.core.database import SessionLocal
>>> from app.models.user import User, UserRole
>>> from app.core.security import get_password_hash
>>> 
>>> db = SessionLocal()
>>> admin = User(
...     email='admin@example.com',
...     hashed_password=get_password_hash('admin123'),
...     full_name='Admin User',
...     role=UserRole.ADMIN,
...     is_active=True
... )
>>> db.add(admin)
>>> db.commit()
>>> print('Admin user created!')
>>> exit()
```

## Accessing the Application

### URLs
- **Frontend**: http://localhost:3000 (Docker) or http://localhost:5173 (Manual)
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **Alternative API Docs**: http://localhost:8000/api/redoc

### Default Credentials

**Admin/Teacher Login:**
- Email: `admin@example.com`
- Password: `admin123`

**Create a Test Parent:**
1. Go to http://localhost:3000/register
2. Fill in the registration form
3. Select "Parent" role

**Create a Test Student:**
1. Login as admin or parent
2. Navigate to student management
3. Create a student profile
4. Use student login at http://localhost:3000/student-login

## Common Issues & Solutions

### Issue: Database connection error

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose ps  # if using Docker
# OR
pg_isready  # if using local PostgreSQL

# Check DATABASE_URL in .env
# Format: postgresql+psycopg2://user:password@host:5432/dbname
```

### Issue: Frontend can't connect to backend

**Solution:**
```bash
# 1. Check backend is running at http://localhost:8000
curl http://localhost:8000/health

# 2. Check CORS settings in backend/.env
# CORS_ORIGINS should include your frontend URL

# 3. Check frontend .env
# VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Issue: npm install fails

**Solution:**
```bash
# Clear npm cache and try again
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Alembic migration fails

**Solution:**
```bash
# Check database connection
# Then reset and rerun migrations
alembic downgrade base
alembic upgrade head

# If still failing, check:
# 1. Database exists
# 2. User has proper permissions
# 3. DATABASE_URL is correct in .env
```

### Issue: Port already in use

**Solution:**
```bash
# Find and kill process using the port
# On macOS/Linux:
lsof -i :8000  # or :3000, :5432
kill -9 <PID>

# On Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different ports in docker-compose.yml
```

## Next Steps

### 1. Create Sample Content

**As Admin:**
1. Login to http://localhost:3000
2. Navigate to "Lessons"
3. Click "Create Lesson"
4. Fill in lesson details:
   - Title: "Noah's Ark"
   - Age Group: "Ages 4-9"
   - Content: Your lesson content
   - Add media items (YouTube, Spotify links)
5. Publish the lesson

**Create a Quiz:**
1. Navigate to "Quizzes"
2. Click "Create Quiz"
3. Link to a lesson
4. Add questions
5. Set passing score

### 2. Test Student Experience

1. Create a parent account
2. Create a student profile
3. Login as student
4. Browse lessons
5. Complete a lesson
6. Take a quiz
7. View progress dashboard

### 3. Test Chat & Groups

1. Create a group (as admin/teacher)
2. Add students to the group
3. Send messages
4. Test moderation features

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
pytest

# With coverage
pytest --cov=app --cov-report=html

# Frontend tests
cd frontend
npm test
```

### Database Migrations

```bash
# Create a new migration
cd backend
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

### Code Quality

```bash
# Backend linting
cd backend
black .
flake8 .
mypy app/

# Frontend linting
cd frontend
npm run lint
```

## Stopping the Application

### Docker
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (will delete database data)
docker-compose down -v
```

### Manual
```bash
# Press Ctrl+C in each terminal running the services
# Backend: uvicorn terminal
# Frontend: npm dev terminal
```

## Production Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the recommended split production deployment to Netlify/Vercel, Koyeb, and PostgreSQL on Oracle Cloud infrastructure.

## Getting Help

- **Documentation**: Check README.md, ARCHITECTURE.md, API.md
- **API Docs**: http://localhost:8000/api/docs (interactive)
- **Logs**: 
  - Docker: `docker-compose logs -f`
  - Manual: Check terminal outputs

## Success Checklist

- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:3000 or :5173
- [ ] API docs accessible at http://localhost:8000/api/docs
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Can login to admin dashboard
- [ ] Can create a lesson
- [ ] Can create a student profile
- [ ] Student can login
- [ ] Student can view lessons

If all checkboxes are checked, you're all set! 🎉

## Quick Reference

```bash
# Start everything (Docker)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Restart a service
docker-compose restart backend

# Run backend tests
docker-compose exec backend pytest

# Access database
docker-compose exec db psql -U postgres -d kids_bible_db

# Create admin user
docker-compose exec backend python
>>> from app.core.database import SessionLocal
>>> from app.models.user import User, UserRole
>>> from app.core.security import get_password_hash
>>> db = SessionLocal()
>>> admin = User(email='admin@test.com', hashed_password=get_password_hash('admin'), full_name='Admin', role=UserRole.ADMIN, is_active=True)
>>> db.add(admin); db.commit()
```

Happy coding! 🚀
