from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict
from datetime import UTC, datetime, timedelta
from fastapi import HTTPException
from app.models.progress import StudentProgress
from app.models.student import Student, AgeGroup
from app.models.lesson import Lesson
from app.models.quiz import Quiz, QuizAttempt
from app.schemas.progress import ChildProgressSummary, ParentDashboardStats, RecentActivity, StudentDashboardStats


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
        student = db.query(Student).filter(Student.id == student_id).first()
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")
        if not lesson.is_published or lesson.age_group != student.age_group:
            raise HTTPException(status_code=403, detail="Lesson not available")

        progress = db.query(StudentProgress).filter(
            StudentProgress.student_id == student_id,
            StudentProgress.lesson_id == lesson_id
        ).first()
        
        if not progress:
            progress = StudentProgress(
                student_id=student_id,
                lesson_id=lesson_id,
                is_started=True,
                started_at=datetime.now(UTC)
            )
            db.add(progress)
        elif not progress.is_started:
            progress.is_started = True
            progress.started_at = datetime.now(UTC)
        
        progress.last_accessed_at = datetime.now(UTC)
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
        progress.last_accessed_at = datetime.now(UTC)
        
        # Mark as completed if 100%
        if completion_percentage >= 100.0 and not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = datetime.now(UTC)
            
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

        quizzes_attempted = db.query(func.count(QuizAttempt.id)).filter(
            QuizAttempt.student_id == student_id,
            QuizAttempt.is_completed == True
        ).scalar() or 0

        quizzes_passed = db.query(func.count(QuizAttempt.id)).filter(
            QuizAttempt.student_id == student_id,
            QuizAttempt.is_completed == True,
            QuizAttempt.is_passed == True
        ).scalar() or 0
        
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
            quizzes_attempted=quizzes_attempted,
            quizzes_passed=quizzes_passed,
            total_time_spent_minutes=total_time,
            recent_achievements=achievements
        )

    @staticmethod
    def get_parent_dashboard_stats(db: Session, parent_id: int) -> ParentDashboardStats:
        students = db.query(Student).filter(Student.parent_id == parent_id).all()
        children: list[ChildProgressSummary] = []
        recent_activity: list[RecentActivity] = []
        total_family_points = 0
        weekly_activity_minutes = 0
        week_start = datetime.now(UTC) - timedelta(days=7)

        for student in students:
            stats = ProgressService.get_student_dashboard_stats(db, student.id)
            total_family_points += student.total_points

            weekly_activity_minutes += db.query(func.sum(StudentProgress.time_spent_minutes)).filter(
                StudentProgress.student_id == student.id,
                StudentProgress.last_accessed_at >= week_start,
            ).scalar() or 0

            children.append(
                ChildProgressSummary(
                    student_id=student.id,
                    display_name=student.display_name,
                    username=student.username,
                    age_group=student.age_group.value,
                    current_level=student.current_level,
                    total_points=student.total_points,
                    lessons_completed=stats.lessons_completed,
                    lessons_in_progress=stats.lessons_in_progress,
                    quizzes_attempted=stats.quizzes_attempted,
                    quizzes_passed=stats.quizzes_passed,
                    average_quiz_score=stats.average_quiz_score,
                    total_time_spent_minutes=stats.total_time_spent_minutes,
                )
            )

            progress_items = db.query(StudentProgress, Lesson).join(Lesson).filter(
                StudentProgress.student_id == student.id
            ).order_by(StudentProgress.last_accessed_at.desc()).limit(5).all()
            for progress, lesson in progress_items:
                activity_type = "lesson_completed" if progress.is_completed else "lesson_progress"
                recent_activity.append(
                    RecentActivity(
                        student_id=student.id,
                        student_name=student.display_name,
                        activity_type=activity_type,
                        title=lesson.title,
                        occurred_at=progress.completed_at or progress.last_accessed_at,
                    )
                )

            quiz_items = db.query(QuizAttempt, Quiz).join(Quiz).filter(
                QuizAttempt.student_id == student.id,
                QuizAttempt.is_completed == True,
            ).order_by(QuizAttempt.completed_at.desc()).limit(5).all()
            for attempt, quiz in quiz_items:
                recent_activity.append(
                    RecentActivity(
                        student_id=student.id,
                        student_name=student.display_name,
                        activity_type="quiz_passed" if attempt.is_passed else "quiz_attempted",
                        title=quiz.title,
                        occurred_at=attempt.completed_at,
                        score=attempt.score,
                    )
                )

        recent_activity.sort(key=lambda item: item.occurred_at or datetime.min.replace(tzinfo=UTC), reverse=True)

        return ParentDashboardStats(
            total_children=len(students),
            total_family_points=total_family_points,
            weekly_activity_minutes=weekly_activity_minutes,
            children=children,
            recent_activity=recent_activity[:10],
        )
