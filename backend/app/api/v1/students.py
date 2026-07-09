from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_active_user, get_current_student, require_parent, require_teacher
from app.models.user import User
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate, StudentResponse, StudentWithProgress
from app.services.progress_service import ProgressService

router = APIRouter()


@router.get("/", response_model=List[StudentResponse])
def list_students(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """List all students (teacher/admin only)."""
    query = db.query(Student)
    
    if search:
        query = query.filter(Student.username.ilike(f"%{search}%"))
        
    students = query.offset(skip).limit(limit).all()
    return students


@router.post("/", response_model=StudentResponse)
def create_student(
    student_data: StudentCreate,
    current_user: User = Depends(require_parent),
    db: Session = Depends(get_db)
):
    """Create a new student profile (parent/admin only)."""
    parent_id = student_data.parent_id
    if current_user.role.value == "parent":
        parent_id = current_user.id
    elif parent_id is None:
        raise HTTPException(status_code=400, detail="Parent ID is required")

    # Verify parent_id matches current user or current user is admin/teacher
    if parent_id != current_user.id and current_user.role.value not in ["admin", "teacher"]:
        raise HTTPException(status_code=403, detail="Can only create students for yourself")
    
    # Check if username is unique
    existing = db.query(Student).filter(Student.username == student_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    
    student = Student(**student_data.model_dump(exclude={"parent_id"}), parent_id=parent_id)
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


@router.get("/my-students", response_model=List[StudentResponse])
def get_my_students(
    current_user: User = Depends(require_parent),
    db: Session = Depends(get_db)
):
    """Get all students for current parent."""
    students = db.query(Student).filter(Student.parent_id == current_user.id).all()
    return students


@router.get("/peers", response_model=List[StudentResponse])
def list_peers(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """List peers in the same age group."""
    peers = db.query(Student).filter(
        Student.age_group == current_student.age_group,
        Student.id != current_student.id
    ).limit(50).all()
    return peers


@router.get("/me", response_model=StudentWithProgress)
def get_current_student_profile(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get current student's profile with progress."""
    stats = ProgressService.get_student_dashboard_stats(db, current_student.id)
    
    return StudentWithProgress(
        **current_student.__dict__,
        lessons_completed=stats.lessons_completed,
        lessons_in_progress=stats.lessons_in_progress,
        average_quiz_score=stats.average_quiz_score,
        total_time_spent_minutes=stats.total_time_spent_minutes
    )


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(
    student_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get student by ID."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check permissions
    if current_user.role.value not in ["admin", "teacher"] and student.parent_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    return student


@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    student_update: StudentUpdate,
    current_user: User = Depends(require_parent),
    db: Session = Depends(get_db)
):
    """Update student profile."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check permissions
    if student.parent_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = student_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(student, field, value)
    
    db.commit()
    db.refresh(student)
    return student


@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    current_user: User = Depends(require_parent),
    db: Session = Depends(get_db)
):
    """Delete student profile."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Check permissions
    if student.parent_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}
