from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from app.models.types import value_enum
import enum


class MessageType(str, enum.Enum):
    TEXT = "text"
    LESSON_SHARE = "lesson_share"
    SYSTEM = "system"


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Teacher/Admin
    student_sender_id = Column(Integer, ForeignKey("students.id"), nullable=True)  # Student
    message_type = Column(value_enum(MessageType, "messagetype"), default=MessageType.TEXT, nullable=False)
    content = Column(Text, nullable=False)
    extra_data = Column(Text, nullable=True)  # JSON string for lesson shares, etc.
    is_moderated = Column(Boolean, default=False, nullable=False)
    is_flagged = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    edited_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    group = relationship("Group", back_populates="messages")
    sender = relationship("User", back_populates="messages_sent", foreign_keys=[sender_id])
    sender_student = relationship("Student", back_populates="messages", foreign_keys=[student_sender_id])
