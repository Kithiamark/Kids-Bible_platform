from fastapi import FastAPI
from app.core.config import settings
from app.api.auth.routes import router as auth_router

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
)

app.include_router(auth_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
