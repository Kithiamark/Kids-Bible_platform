from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from app.models.student import AgeGroup
from app.models.lesson import MediaType


class LessonMediaBase(BaseModel):
    media_type: MediaType
    title: str
    description: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    duration: Optional[int] = None
    order_index: int


class LessonMediaCreate(LessonMediaBase):
    pass


class LessonMediaResponse(LessonMediaBase):
    id: int
    lesson_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class LessonBase(BaseModel):
    title: str
    description: Optional[str] = None
    content: str
    age_group: AgeGroup
    order_index: int
    is_published: bool = False
    thumbnail_url: Optional[str] = None


class LessonCreate(LessonBase):
    media_items: Optional[List[LessonMediaCreate]] = []


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    age_group: Optional[AgeGroup] = None
    order_index: Optional[int] = None
    is_published: Optional[bool] = None
    thumbnail_url: Optional[str] = None


class LessonInDB(LessonBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class LessonResponse(LessonInDB):
    media_items: List[LessonMediaResponse] = []


class LessonWithProgress(LessonResponse):
    is_started: bool = False
    is_completed: bool = False
    completion_percentage: float = 0.0
