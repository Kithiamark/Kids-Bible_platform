from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import Dict
from datetime import datetime
from app.models.progress import StudentProgress
from app.models.student import Student, AgeGroup
from app.models.lesson import Lesson
from app.models.quiz import QuizAttempt
from app.schemas.progress import StudentDashboardStats


class ProgressService:
    """Service for tracking and calculating student progress."""
    
    # Level calculation thresholds
    LEVEL_THRESHOLDS = {
        AgeGroup.TODDLERS: [0, 50, 150, 300, 500, 800, 1200],
        AgeGroup.AGES_4_9: [0, 100, 300, 600, 1000, 1500, 2100],
        AgeGroup.AGES_10_12: [0, 150, 450, 900, 1500, 2250, 3150],
        AgeGroup.TEENS: [0, 200, 600, 1200, 2000, 3000, 4200],
    }
    
    @staticmethod
    def start_lesson(db: Session, student_id: int, lesson_id: int) -> StudentProgress:
        """Mark a lesson as started for a student."""
        progress = db.query(StudentProgress).filter(
            StudentProgress.student_id == student_id,
            StudentProgress.lesson_id == lesson_id
        ).first()
        
        if not progress:
            progress = StudentProgress(
                student_id=student_id,
                lesson_id=lesson_id,
                is_started=True,
                started_at=datetime.utcnow()
            )
            db.add(progress)
        elif not progress.is_started:
            progress.is_started = True
            progress.started_at = datetime.utcnow()
        
        progress.last_accessed_at = datetime.utcnow()
        db.commit()
        db.refresh(progress)
        return progress
    
    @staticmethod
    def update_lesson_progress(
        db: Session,
        student_id: int,
        lesson_id: int,
        completion_percentage: float,
        time_spent_minutes: int = 0
    ) -> StudentProgress:
        """Update lesson progress for a student."""
        progress = db.query(StudentProgress).filter(
            StudentProgress.student_id == student_id,
            StudentProgress.lesson_id == lesson_id
        ).first()
        
        if not progress:
            progress = ProgressService.start_lesson(db, student_id, lesson_id)
        
        progress.completion_percentage = min(completion_percentage, 100.0)
        progress.time_spent_minutes += time_spent_minutes
        progress.last_accessed_at = datetime.utcnow()
        
        # Mark as completed if 100%
        if completion_percentage >= 100.0 and not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = datetime.utcnow()
            
            # Award completion points
            student = db.query(Student).filter(Student.id == student_id).first()
            lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
            if student and lesson:
                # Award points based on lesson complexity (10-50 points)
                base_points = 30
                student.total_points += base_points
        
        db.commit()
        db.refresh(progress)
        
        # Update student level
        ProgressService.update_student_level(db, student_id)
        
        return progress
    
    @staticmethod
    def update_student_level(db: Session, student_id: int):
        """Calculate and update student's level based on points and progress."""
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return
        
        thresholds = ProgressService.LEVEL_THRESHOLDS.get(
            student.age_group,
            ProgressService.LEVEL_THRESHOLDS[AgeGroup.AGES_4_9]
        )
        
        # Find the appropriate level
        new_level = 1
        for level, threshold in enumerate(thresholds, start=1):
            if student.total_points >= threshold:
                new_level = level
            else:
                break
        
        if student.current_level != new_level:
            student.current_level = new_level
            db.commit()
    
    @staticmethod
    def get_student_dashboard_stats(db: Session, student_id: int) -> StudentDashboardStats:
        """Get comprehensive dashboard statistics for a student."""
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise ValueError("Student not found")
        
        # Total lessons for age group
        total_lessons = db.query(func.count(Lesson.id)).filter(
            Lesson.age_group == student.age_group,
            Lesson.is_published == True
        ).scalar() or 0
        
        # Completed lessons
        lessons_completed = db.query(func.count(StudentProgress.id)).filter(
            StudentProgress.student_id == student_id,
            StudentProgress.is_completed == True
        ).scalar() or 0
        
        # In-progress lessons
        lessons_in_progress = db.query(func.count(StudentProgress.id)).filter(
            StudentProgress.student_id == student_id,
            StudentProgress.is_started == True,
            StudentProgress.is_completed == False
        ).scalar() or 0
        
        # Average quiz score
        avg_score = db.query(func.avg(QuizAttempt.score)).filter(
            QuizAttempt.student_id == student_id,
            QuizAttempt.is_completed == True
        ).scalar() or 0.0
        
        # Total time spent
        total_time = db.query(func.sum(StudentProgress.time_spent_minutes)).filter(
            StudentProgress.student_id == student_id
        ).scalar() or 0
        
        # Recent achievements
        achievements = []
        if lessons_completed >= 1:
            achievements.append("First Lesson Completed!")
        if lessons_completed >= 10:
            achievements.append("10 Lessons Mastered!")
        if student.current_level >= 5:
            achievements.append("Level 5 Achiever!")
        if avg_score >= 90:
            achievements.append("Quiz Master!")
        
        return StudentDashboardStats(
            total_lessons=total_lessons,
            lessons_completed=lessons_completed,
            lessons_in_progress=lessons_in_progress,
            current_level=student.current_level,
            total_points=student.total_points,
            average_quiz_score=round(avg_score, 2),
            total_time_spent_minutes=total_time,
            recent_achievements=achievements
        )
