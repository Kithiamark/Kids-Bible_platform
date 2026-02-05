from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class AgeGroup(str, enum.Enum):
    TODDLERS = "toddlers"
    AGES_4_9 = "ages_4_9"
    AGES_10_12 = "ages_10_12"
    TEENS = "teens"


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    display_name = Column(String, nullable=False)
    age_group = Column(SQLEnum(AgeGroup), nullable=False)
    avatar_url = Column(String, nullable=True)
    current_level = Column(Integer, default=1, nullable=False)
    total_points = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    parent = relationship("User", back_populates="students", foreign_keys=[parent_id])
    progress_records = relationship("StudentProgress", back_populates="student")
    quiz_attempts = relationship("QuizAttempt", back_populates="student")
    messages = relationship("Message", back_populates="sender_student", foreign_keys="Message.student_sender_id")
    group_memberships = relationship("GroupMembership", back_populates="student")
