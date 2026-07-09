from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.student import AgeGroup


class StudentBase(BaseModel):
    username: str
    display_name: str
    age_group: AgeGroup
    avatar_url: Optional[str] = None


class StudentCreate(StudentBase):
    parent_id: Optional[int] = None


class StudentUpdate(BaseModel):
    display_name: Optional[str] = None
    age_group: Optional[AgeGroup] = None
    avatar_url: Optional[str] = None


class StudentInDB(StudentBase):
    id: int
    parent_id: int
    current_level: int
    total_points: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class StudentResponse(StudentInDB):
    pass


class StudentWithProgress(StudentResponse):
    lessons_completed: int
    lessons_in_progress: int
    average_quiz_score: float
    total_time_spent_minutes: int
