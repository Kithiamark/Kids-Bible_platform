from app.core.security import get_password_hash
from app.models.lesson import Lesson
from app.models.quiz import Question, QuestionType, Quiz
from app.models.student import AgeGroup, Student
from app.models.user import User, UserRole


def create_student_user_pair(db):
    parent = User(
        email="learning-parent@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Learning Parent",
        role=UserRole.PARENT,
        is_active=True,
    )
    db.add(parent)
    db.commit()
    db.refresh(parent)

    student = Student(
        parent_id=parent.id,
        username="learning-kid",
        display_name="Learning Kid",
        age_group=AgeGroup.AGES_4_9,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return parent, student


def login_student(client, username, parent_email):
    response = client.post(
        "/api/v1/auth/student-login",
        json={"username": username, "parent_email": parent_email},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def create_published_lesson_with_quiz(db, creator):
    lesson = Lesson(
        title="Creation",
        description="Creation lesson",
        content="<p>God created light.</p>",
        age_group=AgeGroup.AGES_4_9,
        order_index=1,
        is_published=True,
        created_by=creator.id,
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)

    quiz = Quiz(
        lesson_id=lesson.id,
        title="Creation Check",
        description="Self assessment",
        passing_score=70,
        max_attempts=3,
        is_active=True,
        created_by=creator.id,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)

    question = Question(
        quiz_id=quiz.id,
        question_type=QuestionType.MULTIPLE_CHOICE,
        question_text="What did God create first?",
        options=[{"id": "light", "text": "Light"}, {"id": "trees", "text": "Trees"}],
        correct_answer="light",
        points=2,
        order_index=1,
        explanation="Genesis begins with God creating light.",
    )
    db.add(question)
    db.commit()
    db.refresh(question)
    return lesson, quiz, question


def test_student_can_complete_lesson_and_quiz_flow(client, db, test_admin):
    parent, student = create_student_user_pair(db)
    lesson, quiz, question = create_published_lesson_with_quiz(db, test_admin)
    headers = login_student(client, student.username, parent.email)

    lessons_response = client.get("/api/v1/lessons/student", headers=headers)
    lesson_response = client.get(f"/api/v1/lessons/student/{lesson.id}", headers=headers)
    start_lesson_response = client.post(f"/api/v1/progress/lessons/{lesson.id}/start", headers=headers)
    quiz_list_response = client.get(f"/api/v1/quizzes/student/lesson/{lesson.id}", headers=headers)
    quiz_response = client.get(f"/api/v1/quizzes/{quiz.id}/student", headers=headers)
    start_quiz_response = client.post(f"/api/v1/quizzes/{quiz.id}/start", headers=headers)
    attempt_id = start_quiz_response.json()["id"]
    submit_response = client.post(
        f"/api/v1/quizzes/attempts/{attempt_id}/submit",
        headers=headers,
        json={
            "quiz_id": quiz.id,
            "answers": [{"question_id": question.id, "selected_answer": "light"}],
        },
    )

    assert lessons_response.status_code == 200
    assert lesson_response.status_code == 200
    assert start_lesson_response.status_code == 200
    assert quiz_list_response.status_code == 200
    assert quiz_response.status_code == 200
    assert start_quiz_response.status_code == 200
    assert submit_response.status_code == 200
    assert submit_response.json()["score"] == 100
    assert submit_response.json()["answers"][0]["is_correct"] is True


def test_student_cannot_access_wrong_age_lesson_or_quiz(client, db, test_admin):
    parent, student = create_student_user_pair(db)
    lesson = Lesson(
        title="Teen Lesson",
        content="Teen content",
        age_group=AgeGroup.TEENS,
        order_index=1,
        is_published=True,
        created_by=test_admin.id,
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    quiz = Quiz(
        lesson_id=lesson.id,
        title="Teen Quiz",
        passing_score=70,
        is_active=True,
        created_by=test_admin.id,
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    headers = login_student(client, student.username, parent.email)

    lesson_response = client.get(f"/api/v1/lessons/student/{lesson.id}", headers=headers)
    progress_response = client.post(f"/api/v1/progress/lessons/{lesson.id}/start", headers=headers)
    quiz_response = client.get(f"/api/v1/quizzes/{quiz.id}/student", headers=headers)
    start_quiz_response = client.post(f"/api/v1/quizzes/{quiz.id}/start", headers=headers)

    assert lesson_response.status_code == 403
    assert progress_response.status_code == 403
    assert quiz_response.status_code == 403
    assert start_quiz_response.status_code == 403
