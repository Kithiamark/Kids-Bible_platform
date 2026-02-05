import pytest


def test_create_lesson(client, admin_headers):
    """Test creating a lesson as admin."""
    response = client.post(
        "/api/v1/lessons/",
        headers=admin_headers,
        json={
            "title": "Test Lesson",
            "description": "A test lesson",
            "content": "Lesson content here",
            "age_group": "ages_4_9",
            "order_index": 1,
            "is_published": True,
            "media_items": []
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Lesson"
    assert data["age_group"] == "ages_4_9"


def test_create_lesson_unauthorized(client, auth_headers):
    """Test that non-admin cannot create lessons."""
    response = client.post(
        "/api/v1/lessons/",
        headers=auth_headers,
        json={
            "title": "Test Lesson",
            "content": "Content",
            "age_group": "ages_4_9",
            "order_index": 1
        }
    )
    assert response.status_code == 403


def test_list_lessons(client, auth_headers):
    """Test listing lessons."""
    response = client.get("/api/v1/lessons/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_lesson(client, admin_headers):
    """Test getting a specific lesson."""
    # Create lesson first
    create_response = client.post(
        "/api/v1/lessons/",
        headers=admin_headers,
        json={
            "title": "Test Lesson",
            "description": "A test lesson",
            "content": "Lesson content",
            "age_group": "ages_4_9",
            "order_index": 1,
            "is_published": True,
            "media_items": []
        }
    )
    lesson_id = create_response.json()["id"]

    # Get the lesson
    response = client.get(f"/api/v1/lessons/{lesson_id}", headers=admin_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == lesson_id
    assert data["title"] == "Test Lesson"


def test_update_lesson(client, admin_headers):
    """Test updating a lesson."""
    # Create lesson first
    create_response = client.post(
        "/api/v1/lessons/",
        headers=admin_headers,
        json={
            "title": "Original Title",
            "content": "Original content",
            "age_group": "ages_4_9",
            "order_index": 1,
            "is_published": False,
            "media_items": []
        }
    )
    lesson_id = create_response.json()["id"]

    # Update the lesson
    response = client.put(
        f"/api/v1/lessons/{lesson_id}",
        headers=admin_headers,
        json={"title": "Updated Title", "is_published": True}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["is_published"] == True


def test_delete_lesson(client, admin_headers):
    """Test deleting a lesson."""
    # Create lesson first
    create_response = client.post(
        "/api/v1/lessons/",
        headers=admin_headers,
        json={
            "title": "To Delete",
            "content": "Content",
            "age_group": "ages_4_9",
            "order_index": 1,
            "media_items": []
        }
    )
    lesson_id = create_response.json()["id"]

    # Delete the lesson
    response = client.delete(f"/api/v1/lessons/{lesson_id}", headers=admin_headers)
    assert response.status_code == 200

    # Verify it's deleted
    get_response = client.get(f"/api/v1/lessons/{lesson_id}", headers=admin_headers)
    assert get_response.status_code == 404
