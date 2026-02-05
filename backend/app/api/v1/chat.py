from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_active_user, get_current_student
from app.models.user import User
from app.models.student import Student
from app.models.chat import Message
from app.schemas.chat import MessageCreate, MessageResponse

router = APIRouter()


@router.post("/messages", response_model=MessageResponse)
def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Send a message to a group (user)."""
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
    
    # Add sender info
    response = MessageResponse(**message.__dict__)
    response.sender_name = current_user.full_name
    return response


@router.post("/messages/student", response_model=MessageResponse)
def send_student_message(
    message_data: MessageCreate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Send a message to a group (student)."""
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
    
    # Add sender info
    response = MessageResponse(**message.__dict__)
    response.sender_name = current_student.display_name
    response.sender_avatar = current_student.avatar_url
    return response


@router.get("/groups/{group_id}/messages", response_model=List[MessageResponse])
def get_group_messages(
    group_id: int,
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get messages for a group."""
    messages = db.query(Message).filter(
        Message.group_id == group_id
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    
    # Add sender info
    result = []
    for msg in messages:
        msg_dict = msg.__dict__.copy()
        msg_response = MessageResponse(**msg_dict)
        
        if msg.sender_id:
            sender = db.query(User).filter(User.id == msg.sender_id).first()
            if sender:
                msg_response.sender_name = sender.full_name
        elif msg.student_sender_id:
            student = db.query(Student).filter(Student.id == msg.student_sender_id).first()
            if student:
                msg_response.sender_name = student.display_name
                msg_response.sender_avatar = student.avatar_url
        
        result.append(msg_response)
    
    return result


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
    
    # Check permissions
    is_own_message = message.sender_id == current_user.id
    is_moderator = current_user.role.value in ["admin", "teacher"]
    
    if not (is_own_message or is_moderator):
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
    
    message.is_flagged = True
    db.commit()
    return {"message": "Message flagged for review"}
