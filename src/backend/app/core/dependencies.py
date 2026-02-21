from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.user import User, UserRole
from app.core.config import SECRET_KEY, ALGORITHM


# ============================================
# OAuth2 Bearer Token
# ============================================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ============================================
# Get Current Logged-in User
# ============================================
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id: str = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    # Fetch user from DB
    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise credentials_exception

    return user


# ============================================
# Role-Based Access Control
# ============================================

def require_manager(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager access required"
        )
    return current_user


def require_employee(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.EMPLOYEE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Employee access required"
        )
    return current_user


def require_chief(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.CHIEF:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chief access required"
        )
    return current_user