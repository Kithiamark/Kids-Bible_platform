from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
from mangum import Mangum
from app.core.config import settings
from app.core.database import engine, Base
from app import models  # noqa: F401 - ensure SQLAlchemy models are registered
from app.api.v1 import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize local development storage without bypassing production migrations."""
    if settings.environment == "development" and settings.database_url.startswith("sqlite"):
        Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.app_name,
    version=settings.api_version,
    description="Kids Delight Learning Platform API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware
# In development: use regex to allow localhost/127.0.0.1 on ANY port (Vite uses random ports)
# In production: use explicit allow_origins from env
if settings.environment == "development":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:8000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
else:
    cors_origins = [origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

# Add security middleware for production
if settings.environment == "production":
    allowed_hosts = [host.strip() for host in settings.allowed_hosts.split(",") if host.strip()]
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=allowed_hosts
    )

# Include API routes
app.include_router(api_router, prefix=f"/api/{settings.api_version}")

# Create Mangum handler for AWS Lambda
handler = Mangum(app)


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Kids Delight Learning Platform API",
        "version": settings.api_version,
        "docs": "/api/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "environment": settings.environment}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )
