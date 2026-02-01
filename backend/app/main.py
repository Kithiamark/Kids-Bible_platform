from fastapi import FastAPI
from app.core.config import settings

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Backend API for Kids Bible Learning Platform"
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "environment": settings.environment
    }
