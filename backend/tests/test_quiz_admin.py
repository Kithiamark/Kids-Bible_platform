from app.models.quiz import Question


def create_lesson(client, headers):
    response = client.post(
        "/api/v1/lessons/",
        headers=headers,
        json={
            "title": "Quiz Admin Lesson",
            "content": "Lesson content",
            "age_group": "ages_4_9",
            "order_index": 1,
            "is_published": True,
            "media_items": [],
        },
    )
    assert response.status_code == 200
    return response.json()


def test_teacher_can_update_quiz_questions(client, db, teacher_headers):
    lesson = create_lesson(client, teacher_headers)
    create_response = client.post(
        "/api/v1/quizzes/",
        headers=teacher_headers,
        json={
            "lesson_id": lesson["id"],
            "title": "Original Quiz",
            "passing_score": 70,
            "max_attempts": 3,
            "is_active": True,
            "questions": [
                {
                    "question_type": "multiple_choice",
                    "question_text": "Old question?",
                    "options": [{"id": "a", "text": "Old A"}, {"id": "b", "text": "Old B"}],
                    "correct_answer": "a",
                    "points": 1,
                    "order_index": 1,
                }
            ],
        },
    )
    assert create_response.status_code == 200
    quiz_id = create_response.json()["id"]

    update_response = client.put(
        f"/api/v1/quizzes/{quiz_id}",
        headers=teacher_headers,
        json={
            "title": "Updated Quiz",
            "questions": [
                {
                    "question_type": "multiple_choice",
                    "question_text": "New first question?",
                    "options": [{"id": "a", "text": "Answer A"}, {"id": "b", "text": "Answer B"}],
                    "correct_answer": "b",
                    "points": 2,
                    "order_index": 1,
                    "explanation": "Helpful feedback",
                },
                {
                    "question_type": "multiple_choice",
                    "question_text": "New second question?",
                    "options": [{"id": "a", "text": "Yes"}, {"id": "b", "text": "No"}],
                    "correct_answer": "a",
                    "points": 1,
                    "order_index": 2,
                },
            ],
        },
    )

    assert update_response.status_code == 200
    data = update_response.json()
    assert data["title"] == "Updated Quiz"
    assert len(data["questions"]) == 2
    assert data["questions"][0]["question_text"] == "New first question?"
    assert db.query(Question).filter(Question.quiz_id == quiz_id).count() == 2
