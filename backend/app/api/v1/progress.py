from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_student
from app.models.student import Student
from app.schemas.progress import ProgressUpdate, ProgressResponse, StudentDashboardStats
from app.services.progress_service import ProgressService

router = APIRouter()


@router.post("/lessons/{lesson_id}/start", response_model=ProgressResponse)
def start_lesson(
    lesson_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Mark a lesson as started."""
    progress = ProgressService.start_lesson(db, current_student.id, lesson_id)
    return progress


@router.put("/lessons/{lesson_id}", response_model=ProgressResponse)
def update_progress(
    lesson_id: int,
    progress_update: ProgressUpdate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Update lesson progress."""
    progress = ProgressService.update_lesson_progress(
        db=db,
        student_id=current_student.id,
        lesson_id=lesson_id,
        completion_percentage=progress_update.completion_percentage or 0.0,
        time_spent_minutes=progress_update.time_spent_minutes or 0
    )
    return progress


@router.get("/dashboard", response_model=StudentDashboardStats)
def get_dashboard_stats(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for current student."""
    return ProgressService.get_student_dashboard_stats(db, current_student.id)
