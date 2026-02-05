from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

engine_args = {
    "echo": settings.debug,
    "pool_pre_ping": True,
}

if "sqlite" not in settings.database_url:
    engine_args["pool_size"] = 10
    engine_args["max_overflow"] = 20
else:
    engine_args["connect_args"] = {"check_same_thread": False}

engine = create_engine(
    settings.database_url,
    **engine_args
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    """Database session dependency."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
