from fastapi import APIRouter
from app.api.v1 import auth, users, students, lessons, quizzes, progress, chat, groups

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(students.router, prefix="/students", tags=["Students"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["Lessons"])
api_router.include_router(quizzes.router, prefix="/quizzes", tags=["Quizzes"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat"])
api_router.include_router(groups.router, prefix="/groups", tags=["Groups"])
