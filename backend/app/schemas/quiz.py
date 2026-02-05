from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.models.quiz import QuestionType


class QuestionOptionBase(BaseModel):
    id: str
    text: str
    image_url: Optional[str] = None


class QuestionBase(BaseModel):
    question_type: QuestionType
    question_text: str
    image_url: Optional[str] = None
    options: List[Dict[str, Any]]
    correct_answer: str
    points: int = 1
    order_index: int
    explanation: Optional[str] = None


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(BaseModel):
    question_type: Optional[QuestionType] = None
    question_text: Optional[str] = None
    image_url: Optional[str] = None
    options: Optional[List[Dict[str, Any]]] = None
    correct_answer: Optional[str] = None
    points: Optional[int] = None
    order_index: Optional[int] = None
    explanation: Optional[str] = None


class QuestionResponse(QuestionBase):
    id: int
    quiz_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class QuestionForStudent(BaseModel):
    """Question without correct answer for student view."""
    id: int
    question_type: QuestionType
    question_text: str
    image_url: Optional[str] = None
    options: List[Dict[str, Any]]
    points: int
    order_index: int
    
    model_config = ConfigDict(from_attributes=True)


class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    passing_score: float = 70.0
    max_attempts: Optional[int] = 3
    is_active: bool = True


class QuizCreate(QuizBase):
    lesson_id: int
    questions: List[QuestionCreate] = []


class QuizUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    passing_score: Optional[float] = None
    max_attempts: Optional[int] = None
    is_active: Optional[bool] = None


class QuizResponse(QuizBase):
    id: int
    lesson_id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    questions: List[QuestionResponse] = []
    
    model_config = ConfigDict(from_attributes=True)


class QuizForStudent(BaseModel):
    """Quiz for student view without correct answers."""
    id: int
    lesson_id: int
    title: str
    description: Optional[str] = None
    passing_score: float
    max_attempts: Optional[int]
    is_active: bool
    questions: List[QuestionForStudent] = []
    
    model_config = ConfigDict(from_attributes=True)


class AnswerSubmit(BaseModel):
    question_id: int
    selected_answer: str


class QuizSubmit(BaseModel):
    quiz_id: int
    answers: List[AnswerSubmit]


class AnswerResult(BaseModel):
    question_id: int
    selected_answer: str
    is_correct: bool
    correct_answer: str
    points_earned: int
    explanation: Optional[str] = None


class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    student_id: int
    attempt_number: int
    score: Optional[float] = None
    total_points: Optional[int] = None
    max_points: Optional[int] = None
    is_passed: bool
    is_completed: bool
    started_at: datetime
    completed_at: Optional[datetime] = None
    answers: List[AnswerResult] = []
    
    model_config = ConfigDict(from_attributes=True)
