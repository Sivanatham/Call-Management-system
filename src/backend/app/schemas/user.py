from pydantic import BaseModel, EmailStr
from typing import Optional, List
from app.models.user import UserRole


# ===============================
# Base User Schema
# ===============================
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None


# ===============================
# Used for Manager Creating Employee
# ===============================
class EmployeeCreate(UserBase):
    password: str


# ===============================
# Used for Public Registration
# ===============================
class UserRegister(UserBase):
    password: str
    role: UserRole


# ===============================
# Response Schema
# ===============================
class UserResponse(UserBase):
    id: int
    role: UserRole

    class Config:
        orm_mode = True


# ===============================
# Employee List Response (FIXED)
# ===============================
class EmployeeListResponse(BaseModel):
    total: int
    skip: int
    limit: int
    employees: List[UserResponse]


# ===============================
# Auth Schemas
# ===============================
class LoginRequest(BaseModel):
    email: str
    password: str


class UpdatePassword(BaseModel):
    old_password: str
    new_password: str