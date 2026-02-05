import enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from app.models.student import AgeGroup


class MediaType(str, enum.Enum):
    PODCAST = "podcast"
    VIDEO = "video"
    TEXT = "text"


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    age_group = Column(SQLEnum(AgeGroup), nullable=False)
    order_index = Column(Integer, nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    creator = relationship("User", back_populates="lessons")
    media_items = relationship("LessonMedia", back_populates="lesson", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="lesson")
    progress_records = relationship("StudentProgress", back_populates="lesson")


class LessonMedia(Base):
    __tablename__ = "lesson_media"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    media_type = Column(SQLEnum(MediaType), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=False)
    thumbnail_url = Column(String, nullable=True)
    duration = Column(Integer, nullable=True)  # in seconds
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    lesson = relationship("Lesson", back_populates="media_items")
