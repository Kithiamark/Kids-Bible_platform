from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.chat import MessageType
from app.models.group import GroupType
from app.models.student import AgeGroup


class MessageBase(BaseModel):
    content: str
    message_type: MessageType = MessageType.TEXT
    extra_data: Optional[str] = None


class MessageCreate(MessageBase):
    group_id: int


class MessageResponse(MessageBase):
    id: int
    group_id: int
    sender_id: Optional[int] = None
    student_sender_id: Optional[int] = None
    is_moderated: bool
    is_flagged: bool
    created_at: datetime
    edited_at: Optional[datetime] = None
    
    # Additional fields for display
    sender_name: Optional[str] = None
    sender_avatar: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class GroupBase(BaseModel):
    name: str
    description: Optional[str] = None
    group_type: GroupType
    age_group: Optional[AgeGroup] = None
    is_active: bool = True


class GroupCreate(GroupBase):
    pass


class GroupUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class GroupResponse(GroupBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    member_count: int = 0
    
    model_config = ConfigDict(from_attributes=True)


class GroupMembershipCreate(BaseModel):
    student_id: Optional[int] = None
    user_id: Optional[int] = None
    group_id: int


class GroupMembershipResponse(BaseModel):
    id: int
    group_id: int
    student_id: Optional[int] = None
    user_id: Optional[int] = None
    joined_at: datetime
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)


class DirectChatCreate(BaseModel):
    target_student_id: Optional[int] = None
    target_user_id: Optional[int] = None
