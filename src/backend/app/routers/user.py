from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User
from app.models.team import Team
from app.schemas.user import UpdatePassword
from app.core.dependencies import get_current_user, require_manager
from app.schemas.user import UserResponse
from typing import List
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/user", tags=["users"])

# Get profile
@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Fetch team name if user has a team
    team_name = None
    if current_user.team_id:
        team = db.query(Team).filter(Team.id == current_user.team_id).first()
        if team:
            team_name = team.name
    
    user_dict = {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role.value,
        "team_name": team_name
    }
    return user_dict

# Update password
@router.patch("/me/password")
def update_password(data: UpdatePassword, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not pwd_context.verify(data.old_password, current_user.password):
        raise HTTPException(status_code=400, detail="Old password incorrect")
    current_user.password = pwd_context.hash(data.new_password)
    db.commit()
    return {"message": "Password updated successfully"}
