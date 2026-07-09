from app.core.security import get_password_hash
from app.models.chat import Message, MessageType
from app.models.group import Group, GroupMembership, GroupType
from app.models.student import AgeGroup, Student
from app.models.user import User, UserRole


def create_parent(db, email="parent2@example.com"):
    user = User(
        email=email,
        hashed_password=get_password_hash("password123"),
        full_name="Second Parent",
        role=UserRole.PARENT,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_student(db, parent, username="kiddo"):
    student = Student(
        parent_id=parent.id,
        username=username,
        display_name="Kiddo",
        age_group=AgeGroup.AGES_4_9,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def create_group_with_student(db, creator, student, name="Secure Group"):
    group = Group(
        name=name,
        group_type=GroupType.CLASS,
        age_group=AgeGroup.AGES_4_9,
        created_by=creator.id,
        is_active=True,
    )
    db.add(group)
    db.commit()
    db.refresh(group)

    db.add(GroupMembership(group_id=group.id, student_id=student.id, is_active=True))
    db.commit()
    return group


def login_user(client, email, password="password123"):
    response = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def login_student(client, username, parent_email):
    response = client.post(
        "/api/v1/auth/student-login",
        json={"username": username, "parent_email": parent_email},
    )
    assert response.status_code == 200
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def test_student_token_cannot_access_user_routes(client, db, test_user):
    student = create_student(db, test_user)
    headers = login_student(client, student.username, test_user.email)

    response = client.get("/api/v1/users/me", headers=headers)

    assert response.status_code == 401


def test_student_can_only_read_joined_group(client, db, test_admin, test_user):
    student = create_student(db, test_user)
    joined_group = create_group_with_student(db, test_admin, student)
    other_group = Group(
        name="Other Group",
        group_type=GroupType.CLASS,
        age_group=AgeGroup.AGES_4_9,
        created_by=test_admin.id,
        is_active=True,
    )
    db.add(other_group)
    db.add(Message(group_id=joined_group.id, student_sender_id=student.id, message_type=MessageType.TEXT, content="Hi"))
    db.commit()
    headers = login_student(client, student.username, test_user.email)

    joined_response = client.get(f"/api/v1/chat/student/groups/{joined_group.id}/messages", headers=headers)
    other_response = client.get(f"/api/v1/chat/student/groups/{other_group.id}/messages", headers=headers)

    assert joined_response.status_code == 200
    assert joined_response.json()[0]["content"] == "Hi"
    assert other_response.status_code == 403


def test_student_cannot_send_to_unjoined_group(client, db, test_admin, test_user):
    student = create_student(db, test_user)
    group = Group(
        name="Locked Group",
        group_type=GroupType.CLASS,
        age_group=AgeGroup.AGES_4_9,
        created_by=test_admin.id,
        is_active=True,
    )
    db.add(group)
    db.commit()
    db.refresh(group)
    headers = login_student(client, student.username, test_user.email)

    response = client.post(
        "/api/v1/chat/messages/student",
        headers=headers,
        json={"group_id": group.id, "content": "Should not send", "message_type": "text"},
    )

    assert response.status_code == 403


def test_parent_can_monitor_but_not_send_to_child_group(client, db, test_admin, test_user):
    student = create_student(db, test_user)
    group = create_group_with_student(db, test_admin, student)
    db.add(Message(group_id=group.id, student_sender_id=student.id, message_type=MessageType.TEXT, content="Parent can see"))
    db.commit()
    headers = login_user(client, test_user.email, "testpassword")

    read_response = client.get(f"/api/v1/chat/groups/{group.id}/messages", headers=headers)
    send_response = client.post(
        "/api/v1/chat/messages",
        headers=headers,
        json={"group_id": group.id, "content": "Parent should not send", "message_type": "text"},
    )

    assert read_response.status_code == 200
    assert read_response.json()[0]["content"] == "Parent can see"
    assert send_response.status_code == 403


def test_unrelated_parent_cannot_read_child_group(client, db, test_admin, test_user):
    student = create_student(db, test_user)
    group = create_group_with_student(db, test_admin, student)
    other_parent = create_parent(db)
    headers = login_user(client, other_parent.email)

    response = client.get(f"/api/v1/chat/groups/{group.id}/messages", headers=headers)

    assert response.status_code == 403


def test_user_member_can_send_direct_message(client, db, test_user):
    teacher = User(
        email="teacher@example.com",
        hashed_password=get_password_hash("password123"),
        full_name="Teacher",
        role=UserRole.TEACHER,
        is_active=True,
    )
    db.add(teacher)
    db.commit()
    db.refresh(teacher)

    group = Group(name="Direct", group_type=GroupType.DIRECT, created_by=teacher.id, is_active=True)
    db.add(group)
    db.commit()
    db.refresh(group)
    db.add(GroupMembership(group_id=group.id, user_id=test_user.id, is_active=True))
    db.add(GroupMembership(group_id=group.id, user_id=teacher.id, is_active=True))
    db.commit()
    headers = login_user(client, test_user.email, "testpassword")

    response = client.post(
        "/api/v1/chat/messages",
        headers=headers,
        json={"group_id": group.id, "content": "Hello teacher", "message_type": "text"},
    )

    assert response.status_code == 200
    assert response.json()["content"] == "Hello teacher"


def test_parent_cannot_start_direct_chat_with_another_parent(client, db, test_user):
    other_parent = create_parent(db, "other-parent@example.com")
    headers = login_user(client, test_user.email, "testpassword")

    response = client.post(
        "/api/v1/groups/direct/user",
        headers=headers,
        json={"target_user_id": other_parent.id},
    )

    assert response.status_code == 403


def test_student_direct_chat_requires_same_age_group(client, db, test_user):
    student = create_student(db, test_user, "same-age-kid")
    other_parent = create_parent(db, "teen-parent@example.com")
    teen = Student(
        parent_id=other_parent.id,
        username="teen-kid",
        display_name="Teen Kid",
        age_group=AgeGroup.TEENS,
    )
    db.add(teen)
    db.commit()
    db.refresh(teen)
    headers = login_student(client, student.username, test_user.email)

    response = client.post(
        "/api/v1/groups/direct/student",
        headers=headers,
        json={"target_student_id": teen.id},
    )

    assert response.status_code == 403


def test_student_can_flag_visible_message_and_staff_can_review(client, db, test_admin, test_user, admin_headers):
    student = create_student(db, test_user)
    group = create_group_with_student(db, test_admin, student)
    message = Message(
        group_id=group.id,
        sender_id=test_admin.id,
        message_type=MessageType.TEXT,
        content="Please review this",
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    student_headers = login_student(client, student.username, test_user.email)

    flag_response = client.put(f"/api/v1/chat/messages/student/{message.id}/flag", headers=student_headers)
    flagged_response = client.get("/api/v1/chat/messages/flagged", headers=admin_headers)
    moderate_response = client.put(
        f"/api/v1/chat/messages/{message.id}/moderation",
        headers=admin_headers,
        json={"is_flagged": False, "is_moderated": True},
    )

    assert flag_response.status_code == 200
    assert flagged_response.status_code == 200
    assert any(item["id"] == message.id for item in flagged_response.json())
    assert moderate_response.status_code == 200
    assert moderate_response.json()["is_flagged"] is False
    assert moderate_response.json()["is_moderated"] is True


def test_student_can_delete_only_own_message(client, db, test_admin, test_user):
    student = create_student(db, test_user)
    group = create_group_with_student(db, test_admin, student)
    own_message = Message(
        group_id=group.id,
        student_sender_id=student.id,
        message_type=MessageType.TEXT,
        content="Mine",
    )
    staff_message = Message(
        group_id=group.id,
        sender_id=test_admin.id,
        message_type=MessageType.TEXT,
        content="Not mine",
    )
    db.add(own_message)
    db.add(staff_message)
    db.commit()
    db.refresh(own_message)
    db.refresh(staff_message)
    headers = login_student(client, student.username, test_user.email)

    own_response = client.delete(f"/api/v1/chat/messages/student/{own_message.id}", headers=headers)
    staff_response = client.delete(f"/api/v1/chat/messages/student/{staff_message.id}", headers=headers)

    assert own_response.status_code == 200
    assert staff_response.status_code == 403
