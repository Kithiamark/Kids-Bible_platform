from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.core.database import get_db
from app.core.security import get_current_active_user, get_current_student, require_teacher
from app.models.user import User
from app.models.student import Student
from app.models.group import Group, GroupMembership, GroupType
from app.schemas.chat import GroupCreate, GroupUpdate, GroupResponse, GroupMembershipCreate, GroupMembershipResponse, DirectChatCreate

router = APIRouter()


@router.post("/direct/student", response_model=GroupResponse)
def create_student_direct_chat(
    chat_data: DirectChatCreate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Create or get direct chat for student with another student."""
    if not chat_data.target_student_id:
        raise HTTPException(status_code=400, detail="Target student ID required")
        
    target_student = db.query(Student).filter(Student.id == chat_data.target_student_id).first()
    if not target_student:
        raise HTTPException(status_code=404, detail="Target student not found")
        
    # Check if direct group already exists
    # Complex query: find group where both students are members and type is DIRECT
    # Simplification: Loop or subquery. 
    # Proper SQL way: Group with exactly these 2 members.
    
    # Let's find groups where current_student is member
    my_groups = db.query(GroupMembership.group_id).filter(
        GroupMembership.student_id == current_student.id,
        GroupMembership.is_active == True
    ).subquery()
    
    # Find shared group with target_student that is DIRECT
    shared_group = db.query(Group).join(GroupMembership).filter(
        Group.id.in_(my_groups),
        GroupMembership.student_id == target_student.id,
        GroupMembership.is_active == True,
        Group.group_type == GroupType.DIRECT
    ).first()
    
    if shared_group:
        return shared_group
        
    # Create new direct group
    group = Group(
        name=f"{current_student.display_name} & {target_student.display_name}",
        group_type=GroupType.DIRECT,
        created_by=target_student.parent_id, # Placeholder: Created by parent of target or system? 
        # Actually created_by refers to User. Student doesn't map to User directly. 
        # Let's use current_student's parent for now or make created_by nullable?
        # Model says created_by is NOT NULL. 
        # So we use current_student.parent_id
    )
    db.add(group)
    db.commit()
    db.refresh(group)
    
    # Add members
    db.add(GroupMembership(group_id=group.id, student_id=current_student.id))
    db.add(GroupMembership(group_id=group.id, student_id=target_student.id))
    db.commit()
    
    return group


@router.post("/direct/user", response_model=GroupResponse)
def create_user_direct_chat(
    chat_data: DirectChatCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create or get direct chat for user (parent/teacher) with user or student."""
    # Scenario 1: User to User (Parent <-> Teacher)
    if chat_data.target_user_id:
        target_user = db.query(User).filter(User.id == chat_data.target_user_id).first()
        if not target_user:
            raise HTTPException(status_code=404, detail="Target user not found")
            
        # Check existing
        my_groups = db.query(GroupMembership.group_id).filter(
            GroupMembership.user_id == current_user.id,
            GroupMembership.is_active == True
        ).subquery()
        
        shared_group = db.query(Group).join(GroupMembership).filter(
            Group.id.in_(my_groups),
            GroupMembership.user_id == target_user.id,
            GroupMembership.is_active == True,
            Group.group_type == GroupType.DIRECT
        ).first()
        
        if shared_group:
            return shared_group
            
        # Create
        group = Group(
            name=f"{current_user.full_name} & {target_user.full_name}",
            group_type=GroupType.DIRECT,
            created_by=current_user.id
        )
        db.add(group)
        db.commit()
        db.refresh(group)
        
        db.add(GroupMembership(group_id=group.id, user_id=current_user.id))
        db.add(GroupMembership(group_id=group.id, user_id=target_user.id))
        db.commit()
        return group

    # Scenario 2: User to Student (Teacher <-> Student)
    if chat_data.target_student_id:
        target_student = db.query(Student).filter(Student.id == chat_data.target_student_id).first()
        if not target_student:
            raise HTTPException(status_code=404, detail="Target student not found")
            
        my_groups = db.query(GroupMembership.group_id).filter(
            GroupMembership.user_id == current_user.id,
            GroupMembership.is_active == True
        ).subquery()
        
        shared_group = db.query(Group).join(GroupMembership).filter(
            Group.id.in_(my_groups),
            GroupMembership.student_id == target_student.id,
            GroupMembership.is_active == True,
            Group.group_type == GroupType.DIRECT
        ).first()
        
        if shared_group:
            return shared_group
            
        group = Group(
            name=f"{current_user.full_name} & {target_student.display_name}",
            group_type=GroupType.DIRECT,
            created_by=current_user.id
        )
        db.add(group)
        db.commit()
        db.refresh(group)
        
        db.add(GroupMembership(group_id=group.id, user_id=current_user.id))
        db.add(GroupMembership(group_id=group.id, student_id=target_student.id))
        db.commit()
        return group
        
    raise HTTPException(status_code=400, detail="Target required")


@router.post("/", response_model=GroupResponse)
def create_group(
    group_data: GroupCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Create a new group (teacher/admin only)."""
    group = Group(
        name=group_data.name,
        description=group_data.description,
        group_type=group_data.group_type,
        age_group=group_data.age_group,
        is_active=group_data.is_active,
        created_by=current_user.id
    )
    db.add(group)
    db.commit()
    db.refresh(group)
    
    # Count members
    group_response = GroupResponse(**group.__dict__)
    group_response.member_count = 0
    return group_response


@router.get("/", response_model=List[GroupResponse])
def list_groups(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """List all groups."""
    query = db.query(Group).filter(Group.is_active == True)
    groups = query.offset(skip).limit(limit).all()
    
    # Add member counts
    result = []
    for group in groups:
        member_count = db.query(func.count(GroupMembership.id)).filter(
            GroupMembership.group_id == group.id,
            GroupMembership.is_active == True
        ).scalar()
        
        group_response = GroupResponse(**group.__dict__)
        group_response.member_count = member_count
        result.append(group_response)
    
    return result


@router.get("/student", response_model=List[GroupResponse])
def list_student_groups(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """Get groups that current student is a member of."""
    memberships = db.query(GroupMembership).filter(
        GroupMembership.student_id == current_student.id,
        GroupMembership.is_active == True
    ).all()
    
    result = []
    for membership in memberships:
        group = db.query(Group).filter(Group.id == membership.group_id).first()
        if group and group.is_active:
            member_count = db.query(func.count(GroupMembership.id)).filter(
                GroupMembership.group_id == group.id,
                GroupMembership.is_active == True
            ).scalar()
            
            group_response = GroupResponse(**group.__dict__)
            group_response.member_count = member_count
            result.append(group_response)
    
    return result


@router.get("/{group_id}/members", response_model=List[GroupMembershipResponse])
def list_group_members(
    group_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """List members of a group (teacher/admin only)."""
    memberships = db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.is_active == True
    ).all()
    return memberships


@router.post("/{group_id}/members")
def add_group_member(
    group_id: int,
    membership_data: GroupMembershipCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Add a student to a group (teacher/admin only)."""
    # Check if already a member
    existing = db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.student_id == membership_data.student_id
    ).first()
    
    if existing:
        if not existing.is_active:
            existing.is_active = True
            db.commit()
            return {"message": "Student re-added to group"}
        raise HTTPException(status_code=400, detail="Student already in group")
    
    membership = GroupMembership(
        group_id=group_id,
        student_id=membership_data.student_id,
        is_active=True
    )
    db.add(membership)
    db.commit()
    return {"message": "Student added to group successfully"}


@router.delete("/{group_id}/members/{student_id}")
def remove_group_member(
    group_id: int,
    student_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Remove a student from a group (teacher/admin only)."""
    membership = db.query(GroupMembership).filter(
        GroupMembership.group_id == group_id,
        GroupMembership.student_id == student_id
    ).first()
    
    if not membership:
        raise HTTPException(status_code=404, detail="Membership not found")
    
    membership.is_active = False
    db.commit()
    return {"message": "Student removed from group"}


@router.get("/{group_id}", response_model=GroupResponse)
def get_group(
    group_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get group by ID."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    member_count = db.query(func.count(GroupMembership.id)).filter(
        GroupMembership.group_id == group.id,
        GroupMembership.is_active == True
    ).scalar()
    
    group_response = GroupResponse(**group.__dict__)
    group_response.member_count = member_count
    return group_response


@router.put("/{group_id}", response_model=GroupResponse)
def update_group(
    group_id: int,
    group_update: GroupUpdate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Update group (teacher/admin only)."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    update_data = group_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(group, field, value)
    
    db.commit()
    db.refresh(group)
    
    member_count = db.query(func.count(GroupMembership.id)).filter(
        GroupMembership.group_id == group.id,
        GroupMembership.is_active == True
    ).scalar()
    
    group_response = GroupResponse(**group.__dict__)
    group_response.member_count = member_count
    return group_response


@router.delete("/{group_id}")
def delete_group(
    group_id: int,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    """Soft delete group (teacher/admin only)."""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    
    group.is_active = False
    db.commit()
    return {"message": "Group deleted successfully"}
