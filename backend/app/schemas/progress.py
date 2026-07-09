from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ProgressBase(BaseModel):
    student_id: int
    lesson_id: int
    is_started: bool = False
    is_completed: bool = False
    completion_percentage: float = 0.0
    time_spent_minutes: int = 0


class ProgressCreate(BaseModel):
    lesson_id: int
    student_id: int


class ProgressUpdate(BaseModel):
    is_started: Optional[bool] = None
    is_completed: Optional[bool] = None
    completion_percentage: Optional[float] = None
    time_spent_minutes: Optional[int] = None


class ProgressResponse(ProgressBase):
    id: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    last_accessed_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class StudentDashboardStats(BaseModel):
    total_lessons: int
    lessons_completed: int
    lessons_in_progress: int
    current_level: int
    total_points: int
    average_quiz_score: float
    quizzes_attempted: int = 0
    quizzes_passed: int = 0
    total_time_spent_minutes: int
    recent_achievements: list[str] = []


class RecentActivity(BaseModel):
    student_id: int
    student_name: str
    activity_type: str
    title: str
    occurred_at: datetime | None = None
    score: float | None = None


class ChildProgressSummary(BaseModel):
    student_id: int
    display_name: str
    username: str
    age_group: str
    current_level: int
    total_points: int
    lessons_completed: int
    lessons_in_progress: int
    quizzes_attempted: int
    quizzes_passed: int
    average_quiz_score: float
    total_time_spent_minutes: int


class ParentDashboardStats(BaseModel):
    total_children: int
    total_family_points: int
    weekly_activity_minutes: int
    children: list[ChildProgressSummary]
    recent_activity: list[RecentActivity]
