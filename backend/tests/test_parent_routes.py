from app.core.security import get_password_hash
from app.models.chat import Message, MessageType
from app.models.group import Group, GroupMembership, GroupType
from app.models.student import AgeGroup, Student
from app.models.user import User, UserRole


def create_teacher(db):
    teacher = User(
        email="parent-route-teacher@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Parent Route Teacher",
        role=UserRole.TEACHER,
        is_active=True,
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher


def create_child_group(db, teacher, student):
    group = Group(
        name="Child Class",
        group_type=GroupType.CLASS,
        age_group=student.age_group,
        created_by=teacher.id,
        is_active=True,
    )
    db.add(group)
    db.commit()
    db.refresh(group)

    db.add(GroupMembership(group_id=group.id, student_id=student.id, is_active=True))
    db.add(
        Message(
            group_id=group.id,
            sender_id=teacher.id,
            message_type=MessageType.TEXT,
            content="Class update",
        )
    )
    db.commit()
    return group


def test_parent_workspace_routes_are_authorized(client, db, auth_headers, test_user):
    """Parent-visible frontend routes should not hit auth failures."""
    teacher = create_teacher(db)

    create_response = client.post(
        "/api/v1/students/",
        headers=auth_headers,
        json={
            "username": "parent-route-kid",
            "display_name": "Route Kid",
            "age_group": "ages_4_9",
        },
    )
    assert create_response.status_code == 200
    student = db.query(Student).filter(Student.username == "parent-route-kid").one()
    child_group = create_child_group(db, teacher, student)

    direct_response = client.post(
        "/api/v1/groups/direct/user",
        headers=auth_headers,
        json={"target_user_id": teacher.id},
    )
    assert direct_response.status_code == 200
    direct_group_id = direct_response.json()["id"]

    checks = [
        client.get("/api/v1/users/me", headers=auth_headers),
        client.get("/api/v1/users/teachers", headers=auth_headers),
        client.get("/api/v1/progress/parent/dashboard", headers=auth_headers),
        client.get("/api/v1/students/my-students", headers=auth_headers),
        client.get(f"/api/v1/students/{student.id}", headers=auth_headers),
        client.get("/api/v1/groups/me", headers=auth_headers),
        client.get("/api/v1/groups/", headers=auth_headers),
        client.get(f"/api/v1/groups/{direct_group_id}", headers=auth_headers),
        client.get(f"/api/v1/groups/student/{student.id}", headers=auth_headers),
        client.get(f"/api/v1/groups/{child_group.id}", headers=auth_headers),
        client.get(f"/api/v1/chat/groups/{child_group.id}/messages", headers=auth_headers),
    ]

    assert all(response.status_code == 200 for response in checks)


def test_parent_permissions_stay_scoped(client, db, auth_headers, test_user):
    teacher = create_teacher(db)
    other_parent = User(
        email="other-parent-routes@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Other Parent",
        role=UserRole.PARENT,
        is_active=True,
    )
    db.add(other_parent)
    db.commit()
    db.refresh(other_parent)

    student = Student(
        parent_id=test_user.id,
        username="scoped-kid",
        display_name="Scoped Kid",
        age_group=AgeGroup.AGES_4_9,
    )
    other_student = Student(
        parent_id=other_parent.id,
        username="other-scoped-kid",
        display_name="Other Scoped Kid",
        age_group=AgeGroup.AGES_4_9,
    )
    db.add(student)
    db.add(other_student)
    db.commit()
    db.refresh(student)
    db.refresh(other_student)

    child_group = create_child_group(db, teacher, student)

    blocked = [
        client.get("/api/v1/users/", headers=auth_headers),
        client.get(f"/api/v1/users/{teacher.id}", headers=auth_headers),
        client.delete(f"/api/v1/users/{teacher.id}", headers=auth_headers),
        client.get(f"/api/v1/students/{other_student.id}", headers=auth_headers),
        client.get(f"/api/v1/groups/student/{other_student.id}", headers=auth_headers),
        client.post(
            "/api/v1/chat/messages",
            headers=auth_headers,
            json={"group_id": child_group.id, "content": "Should not send", "message_type": "text"},
        ),
        client.post(
            "/api/v1/groups/direct/user",
            headers=auth_headers,
            json={"target_user_id": other_parent.id},
        ),
    ]

    assert all(response.status_code in [403, 404] for response in blocked)
