from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_active_user, get_current_student, require_teacher
from app.models.user import User
from app.models.student import Student
from app.models.quiz import Quiz, QuizAttempt
from app.schemas.quiz import (
    QuizCreate, QuizUpdate, QuizResponse, QuizForStudent,
    QuizSubmit, QuizAttemptResponse
)
from app.services.quiz_service import QuizService

router = APIRouter()


@router.post("/", response_model=QuizResponse)
def create_quiz(
    quiz_data: QuizCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Create a new quiz (teacher/admin only)."""
    return QuizService.create_quiz(db, quiz_data, current_user.id)


@router.get("/", response_model=List[QuizResponse])
def list_quizzes(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """List all quizzes (teacher/admin only)."""
    quizzes = db.query(Quiz).offset(skip).limit(limit).all()
    return quizzes


@router.get("/lesson/{lesson_id}", response_model=List[QuizResponse])
def list_quizzes_for_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all quizzes for a lesson."""
    query = db.query(Quiz).filter(Quiz.lesson_id == lesson_id)
    
    # Only show active quizzes to non-teachers
    if current_user.role.value not in ["admin", "teacher"]:
        query = query.filter(Quiz.is_active == True)
    
    return query.all()


@router.get("/{quiz_id}/student", response_model=QuizForStudent)
def get_quiz_for_student(
    quiz_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get quiz for student (without correct answers)."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    if not quiz.is_active:
        raise HTTPException(status_code=400, detail="Quiz is not active")
    
    return quiz


@router.post("/{quiz_id}/start", response_model=QuizAttemptResponse)
def start_quiz(
    quiz_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Start a new quiz attempt."""
    attempt = QuizService.start_quiz_attempt(db, quiz_id, current_student.id)
    return attempt


@router.post("/attempts/{attempt_id}/submit", response_model=QuizAttemptResponse)
def submit_quiz(
    attempt_id: int,
    submission: QuizSubmit,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Submit quiz answers for auto-grading."""
    # Verify attempt belongs to student
    attempt = db.query(QuizAttempt).filter(QuizAttempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Quiz attempt not found")
    
    if attempt.student_id != current_student.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return QuizService.submit_quiz(db, attempt_id, submission)


@router.get("/{quiz_id}/attempts", response_model=List[QuizAttemptResponse])
def get_quiz_attempts(
    quiz_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get all attempts for a quiz by current student."""
    attempts = QuizService.get_student_attempts(db, quiz_id, current_student.id)
    return attempts


@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(
    quiz_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Get quiz by ID (teacher/admin only)."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz


@router.put("/{quiz_id}", response_model=QuizResponse)
def update_quiz(
    quiz_id: int,
    quiz_update: QuizUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Update quiz (teacher/admin only)."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    update_data = quiz_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(quiz, field, value)
    
    db.commit()
    db.refresh(quiz)
    return quiz


@router.delete("/{quiz_id}")
def delete_quiz(
    quiz_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Delete quiz (teacher/admin only)."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    db.delete(quiz)
    db.commit()
    return {"message": "Quiz deleted successfully"}
