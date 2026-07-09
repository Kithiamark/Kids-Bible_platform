from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from typing import List, Dict
from datetime import UTC, datetime
from app.models.lesson import Lesson
from app.models.quiz import Quiz, Question, QuizAttempt, Answer
from app.models.student import Student
from app.schemas.quiz import QuizCreate, QuizSubmit, QuizUpdate, AnswerResult, QuizAttemptResponse


class QuizService:
    """Service for quiz operations including auto-grading."""
    
    @staticmethod
    def create_quiz(db: Session, quiz_data: QuizCreate, creator_id: int) -> Quiz:
        """Create a new quiz with questions."""
        quiz = Quiz(
            lesson_id=quiz_data.lesson_id,
            title=quiz_data.title,
            description=quiz_data.description,
            passing_score=quiz_data.passing_score,
            max_attempts=quiz_data.max_attempts,
            is_active=quiz_data.is_active,
            created_by=creator_id
        )
        db.add(quiz)
        db.flush()
        
        # Add questions
        for question_data in quiz_data.questions:
            question = Question(
                quiz_id=quiz.id,
                question_type=question_data.question_type,
                question_text=question_data.question_text,
                image_url=question_data.image_url,
                options=question_data.options,
                correct_answer=question_data.correct_answer,
                points=question_data.points,
                order_index=question_data.order_index,
                explanation=question_data.explanation
            )
            db.add(question)
        
        db.commit()
        db.refresh(quiz)
        return quiz

    @staticmethod
    def update_quiz(db: Session, quiz: Quiz, quiz_update: QuizUpdate) -> Quiz:
        """Update quiz metadata and replace its question set when provided."""
        update_data = quiz_update.model_dump(exclude_unset=True, exclude={"questions"})
        for field, value in update_data.items():
            setattr(quiz, field, value)

        if quiz_update.questions is not None:
            db.query(Question).filter(Question.quiz_id == quiz.id).delete()
            db.flush()
            for index, question_data in enumerate(quiz_update.questions, start=1):
                question = Question(
                    quiz_id=quiz.id,
                    question_type=question_data.question_type,
                    question_text=question_data.question_text,
                    image_url=question_data.image_url,
                    options=question_data.options,
                    correct_answer=question_data.correct_answer,
                    points=question_data.points,
                    order_index=question_data.order_index or index,
                    explanation=question_data.explanation,
                )
                db.add(question)

        db.commit()
        db.refresh(quiz)
        return quiz
    
    @staticmethod
    def start_quiz_attempt(db: Session, quiz_id: int, student_id: int) -> QuizAttempt:
        """Start a new quiz attempt for a student."""
        quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        
        if not quiz.is_active:
            raise HTTPException(status_code=400, detail="Quiz is not active")

        student = db.query(Student).filter(Student.id == student_id).first()
        lesson = db.query(Lesson).filter(Lesson.id == quiz.lesson_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        if not lesson or not lesson.is_published or lesson.age_group != student.age_group:
            raise HTTPException(status_code=403, detail="Quiz not available")
        
        # Check attempt limit
        if quiz.max_attempts:
            attempt_count = db.query(func.count(QuizAttempt.id)).filter(
                QuizAttempt.quiz_id == quiz_id,
                QuizAttempt.student_id == student_id
            ).scalar()
            
            if attempt_count >= quiz.max_attempts:
                raise HTTPException(
                    status_code=400,
                    detail=f"Maximum attempts ({quiz.max_attempts}) reached"
                )
        
        # Get next attempt number
        last_attempt = db.query(func.max(QuizAttempt.attempt_number)).filter(
            QuizAttempt.quiz_id == quiz_id,
            QuizAttempt.student_id == student_id
        ).scalar() or 0
        
        attempt = QuizAttempt(
            quiz_id=quiz_id,
            student_id=student_id,
            attempt_number=last_attempt + 1,
            is_completed=False,
            is_passed=False
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)
        return attempt
    
    @staticmethod
    def submit_quiz(db: Session, attempt_id: int, submission: QuizSubmit) -> QuizAttemptResponse:
        """Submit and auto-grade a quiz attempt."""
        attempt = db.query(QuizAttempt).filter(QuizAttempt.id == attempt_id).first()
        if not attempt:
            raise HTTPException(status_code=404, detail="Quiz attempt not found")
        
        if attempt.is_completed:
            raise HTTPException(status_code=400, detail="Quiz already completed")
        
        quiz = db.query(Quiz).filter(Quiz.id == attempt.quiz_id).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")
        if submission.quiz_id != attempt.quiz_id:
            raise HTTPException(status_code=400, detail="Submission does not match quiz attempt")

        questions = db.query(Question).filter(Question.quiz_id == quiz.id).all()
        questions_dict = {q.id: q for q in questions}
        
        # Grade each answer
        total_points = 0
        max_points = sum(q.points for q in questions)
        answer_results = []
        
        for answer_data in submission.answers:
            question = questions_dict.get(answer_data.question_id)
            if not question:
                continue
            
            is_correct = answer_data.selected_answer == question.correct_answer
            points_earned = question.points if is_correct else 0
            total_points += points_earned
            
            # Save answer
            answer = Answer(
                attempt_id=attempt_id,
                question_id=answer_data.question_id,
                selected_answer=answer_data.selected_answer,
                is_correct=is_correct,
                points_earned=points_earned
            )
            db.add(answer)
            
            # Create result
            answer_results.append(AnswerResult(
                question_id=question.id,
                selected_answer=answer_data.selected_answer,
                is_correct=is_correct,
                correct_answer=question.correct_answer,
                points_earned=points_earned,
                explanation=question.explanation
            ))
        
        # Calculate score
        score = (total_points / max_points * 100) if max_points > 0 else 0
        is_passed = score >= quiz.passing_score
        
        # Update attempt
        attempt.total_points = total_points
        attempt.max_points = max_points
        attempt.score = score
        attempt.is_passed = is_passed
        attempt.is_completed = True
        attempt.completed_at = datetime.now(UTC)
        
        # Update student points
        if is_passed:
            student = db.query(Student).filter(Student.id == attempt.student_id).first()
            student.total_points += total_points
        
        db.commit()
        db.refresh(attempt)
        
        return QuizAttemptResponse(
            id=attempt.id,
            quiz_id=attempt.quiz_id,
            student_id=attempt.student_id,
            attempt_number=attempt.attempt_number,
            score=attempt.score,
            total_points=attempt.total_points,
            max_points=attempt.max_points,
            is_passed=attempt.is_passed,
            is_completed=attempt.is_completed,
            started_at=attempt.started_at,
            completed_at=attempt.completed_at,
            answers=answer_results
        )
    
    @staticmethod
    def get_student_attempts(db: Session, quiz_id: int, student_id: int) -> List[QuizAttempt]:
        """Get all attempts for a quiz by a student."""
        return db.query(QuizAttempt).filter(
            QuizAttempt.quiz_id == quiz_id,
            QuizAttempt.student_id == student_id
        ).order_by(QuizAttempt.attempt_number.desc()).all()
