from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.user import UserRegister, EmployeeCreate, UserResponse, LoginRequest
from app.models.user import User, UserRole
from app.crud.user import get_user_by_email
from passlib.context import CryptContext
from jose import jwt
from app.core.dependencies import require_manager
from app.core.config import SECRET_KEY, ALGORITHM
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# ===============================
# PUBLIC REGISTER (optional)
# ===============================
@router.post("/register", response_model=UserResponse)
def register_user(user: UserRegister, db: Session = Depends(get_db)):

    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_password,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ===============================
# LOGIN
# ===============================

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = get_user_by_email(db, form_data.username)

    if not db_user or not verify_password(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    ACCESS_TOKEN_EXPIRE_HOURS = 12
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)

    token_data = {
        "sub": str(db_user.id),
        "exp": expire
    }

    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "role": db_user.role.value
        }
    }
# ===============================
# MANAGER CREATES EMPLOYEE
# ===============================
@router.post("/create-employee", response_model=UserResponse)
def create_employee(
    user: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):

    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        phone=user.phone,
        password=hashed_password,
        role=UserRole.EMPLOYEE
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ===============================
# DELETE EMPLOYEE
# ===============================
@router.delete("/delete-employee/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):

    employee = db.query(User).filter(
        User.id == employee_id,
        User.role == UserRole.EMPLOYEE
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted successfully"}