from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_active_user, get_current_student, require_teacher
from app.models.user import User
from app.models.student import Student, AgeGroup
from app.models.lesson import Lesson, LessonMedia
from app.schemas.lesson import LessonCreate, LessonUpdate, LessonResponse, LessonWithProgress
from app.models.progress import StudentProgress

router = APIRouter()


@router.post("/", response_model=LessonResponse)
def create_lesson(
    lesson_data: LessonCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Create a new lesson (teacher/admin only)."""
    lesson = Lesson(
        title=lesson_data.title,
        description=lesson_data.description,
        content=lesson_data.content,
        age_group=lesson_data.age_group,
        order_index=lesson_data.order_index,
        is_published=lesson_data.is_published,
        thumbnail_url=lesson_data.thumbnail_url,
        created_by=current_user.id
    )
    db.add(lesson)
    db.flush()
    
    # Add media items
    for media_data in lesson_data.media_items:
        media = LessonMedia(
            lesson_id=lesson.id,
            **media_data.model_dump()
        )
        db.add(media)
    
    db.commit()
    db.refresh(lesson)
    return lesson


@router.get("/", response_model=List[LessonResponse])
def list_lessons(
    age_group: Optional[AgeGroup] = None,
    published_only: bool = True,
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List lessons with optional filtering."""
    query = db.query(Lesson)
    
    if age_group:
        query = query.filter(Lesson.age_group == age_group)
    
    if published_only and current_user.role.value not in ["admin", "teacher"]:
        query = query.filter(Lesson.is_published == True)
    
    lessons = query.order_by(Lesson.order_index).offset(skip).limit(limit).all()
    return lessons


@router.get("/student", response_model=List[LessonWithProgress])
def list_lessons_for_student(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get lessons for current student with their progress."""
    lessons = db.query(Lesson).filter(
        Lesson.age_group == current_student.age_group,
        Lesson.is_published == True
    ).order_by(Lesson.order_index).all()
    
    # Get progress for each lesson
    result = []
    for lesson in lessons:
        progress = db.query(StudentProgress).filter(
            StudentProgress.student_id == current_student.id,
            StudentProgress.lesson_id == lesson.id
        ).first()
        
        lesson_dict = lesson.__dict__.copy()
        lesson_with_progress = LessonWithProgress(
            **lesson_dict,
            is_started=progress.is_started if progress else False,
            is_completed=progress.is_completed if progress else False,
            completion_percentage=progress.completion_percentage if progress else 0.0
        )
        result.append(lesson_with_progress)
    
    return result


@router.get("/student/{lesson_id}", response_model=LessonResponse)
def get_lesson_for_student(
    lesson_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get a published lesson available to the current student."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    if not lesson.is_published or lesson.age_group != current_student.age_group:
        raise HTTPException(status_code=403, detail="Lesson not available")

    return lesson


@router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson(
    lesson_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get lesson by ID."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    # Check if published or user has permission
    if not lesson.is_published and current_user.role.value not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Lesson not available")
    
    return lesson


@router.put("/{lesson_id}", response_model=LessonResponse)
def update_lesson(
    lesson_id: int,
    lesson_update: LessonUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Update lesson (teacher/admin only)."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    update_data = lesson_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(lesson, field, value)
    
    db.commit()
    db.refresh(lesson)
    return lesson


@router.delete("/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Delete lesson (teacher/admin only)."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    db.delete(lesson)
    db.commit()
    return {"message": "Lesson deleted successfully"}
