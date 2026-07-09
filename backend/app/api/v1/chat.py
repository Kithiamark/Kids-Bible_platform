from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_active_user, get_current_student, require_teacher
from app.models.user import User
from app.models.student import Student
from app.models.chat import Message
from app.models.group import Group, GroupMembership
from app.schemas.chat import MessageCreate, MessageModerationUpdate, MessageResponse

router = APIRouter()


def get_active_group(db: Session, group_id: int) -> Group:
    group = db.query(Group).filter(
        Group.id == group_id,
        Group.is_active == True
    ).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    return group


def is_user_group_member(db: Session, group_id: int, user_id: int) -> bool:
    return db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.user_id == user_id,
        GroupMembership.is_active == True
    ).first() is not None


def is_student_group_member(db: Session, group_id: int, student_id: int) -> bool:
    return db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.student_id == student_id,
        GroupMembership.is_active == True
    ).first() is not None


def is_parent_of_group_student(db: Session, group_id: int, parent_id: int) -> bool:
    return db.query(GroupMembership).join(Student).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.student_id == Student.id,
        Student.parent_id == parent_id,
        GroupMembership.is_active == True
    ).first() is not None


def can_user_access_group(db: Session, group_id: int, user: User) -> bool:
    if user.role.value in ["admin", "teacher"]:
        return True
    return (
        is_user_group_member(db, group_id, user.id)
        or is_parent_of_group_student(db, group_id, user.id)
    )


def require_user_group_access(db: Session, group_id: int, user: User) -> Group:
    group = get_active_group(db, group_id)
    if not can_user_access_group(db, group_id, user):
        raise HTTPException(status_code=403, detail="Not authorized for this group")
    return group


def require_user_send_access(db: Session, group_id: int, user: User) -> Group:
    group = get_active_group(db, group_id)
    if user.role.value in ["admin", "teacher"] or is_user_group_member(db, group_id, user.id):
        return group
    raise HTTPException(status_code=403, detail="Not authorized to send to this group")


def require_student_group_access(db: Session, group_id: int, student: Student) -> Group:
    group = get_active_group(db, group_id)
    if not is_student_group_member(db, group_id, student.id):
        raise HTTPException(status_code=403, detail="Not authorized for this group")
    return group


def serialize_message(db: Session, message: Message) -> MessageResponse:
    msg_response = MessageResponse.model_validate(message)

    if message.sender_id:
        sender = db.query(User).filter(User.id == message.sender_id).first()
        if sender:
            msg_response.sender_name = sender.full_name
    elif message.student_sender_id:
        student = db.query(Student).filter(Student.id == message.student_sender_id).first()
        if student:
            msg_response.sender_name = student.display_name
            msg_response.sender_avatar = student.avatar_url

    return msg_response


@router.post("/messages", response_model=MessageResponse)
def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a message to a group (user)."""
    require_user_send_access(db, message_data.group_id, current_user)

    message = Message(
        group_id=message_data.group_id,
        sender_id=current_user.id,
        message_type=message_data.message_type,
        content=message_data.content,
        extra_data=message_data.extra_data
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return serialize_message(db, message)


@router.post("/messages/student", response_model=MessageResponse)
def send_student_message(
    message_data: MessageCreate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Send a message to a group (student)."""
    require_student_group_access(db, message_data.group_id, current_student)

    message = Message(
        group_id=message_data.group_id,
        student_sender_id=current_student.id,
        message_type=message_data.message_type,
        content=message_data.content,
        extra_data=message_data.extra_data
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return serialize_message(db, message)


@router.get("/groups/{group_id}/messages", response_model=List[MessageResponse])
def get_group_messages(
    group_id: int,
    skip: int = 0,
    limit: int = Query(default=50, ge=1, le=100),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get messages for a group as a user, staff member, or parent monitor."""
    require_user_group_access(db, group_id, current_user)

    messages = db.query(Message).filter(
        Message.group_id == group_id
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    return [serialize_message(db, msg) for msg in messages]


@router.get("/student/groups/{group_id}/messages", response_model=List[MessageResponse])
def get_student_group_messages(
    group_id: int,
    skip: int = 0,
    limit: int = Query(default=50, ge=1, le=100),
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get messages for a group as the authenticated student."""
    require_student_group_access(db, group_id, current_student)

    messages = db.query(Message).filter(
        Message.group_id == group_id
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    return [serialize_message(db, msg) for msg in messages]


@router.delete("/messages/{message_id}")
def delete_message(
    message_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a message (moderator/admin or own message)."""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    require_user_group_access(db, message.group_id, current_user)
    
    # Check permissions
    is_own_message = message.sender_id == current_user.id
    is_moderator = current_user.role.value in ["admin", "teacher"]
    
    if not (is_own_message or is_moderator):
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}


@router.delete("/messages/student/{message_id}")
def delete_student_message(
    message_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Delete a student's own message."""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    require_student_group_access(db, message.group_id, current_student)

    if message.student_sender_id != current_student.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    db.delete(message)
    db.commit()
    return {"message": "Message deleted successfully"}


@router.put("/messages/{message_id}/flag")
def flag_message(
    message_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Flag a message for moderation."""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    require_user_group_access(db, message.group_id, current_user)
    
    message.is_flagged = True
    db.commit()
    return {"message": "Message flagged for review"}


@router.put("/messages/student/{message_id}/flag")
def flag_student_visible_message(
    message_id: int,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Flag a message visible to the authenticated student."""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    require_student_group_access(db, message.group_id, current_student)

    message.is_flagged = True
    db.commit()
    return {"message": "Message flagged for review"}


@router.get("/messages/flagged", response_model=List[MessageResponse])
def list_flagged_messages(
    skip: int = 0,
    limit: int = Query(default=50, ge=1, le=100),
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """List flagged messages for staff moderation."""
    messages = db.query(Message).filter(
        Message.is_flagged == True
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    return [serialize_message(db, msg) for msg in messages]


@router.put("/messages/{message_id}/moderation", response_model=MessageResponse)
def update_message_moderation(
    message_id: int,
    moderation: MessageModerationUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Update moderation state for a message."""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    update_data = moderation.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(message, field, value)

    db.commit()
    db.refresh(message)
    return serialize_message(db, message)
