from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.call import Call, CallStatus
from app.models.user import User, UserRole
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/")
def dashboard(db: Session = Depends(get_db), current_user=Depends(get_current_user)):

    # ✅ FIX ENUM ROLE CHECK
    if current_user.role not in [UserRole.MANAGER, UserRole.CHIEF]:
        raise HTTPException(status_code=403, detail="Access denied")

    total_calls = db.query(Call).count()

    assigned_calls = db.query(Call).filter(Call.assigned_to_id.isnot(None)).count()
    unassigned_calls = db.query(Call).filter(Call.assigned_to_id.is_(None)).count()

    # ✅ FIX ENUM ROLE FILTER
    total_employees = db.query(User).filter(User.role == UserRole.EMPLOYEE).count()

    # ✅ FIX ENUM STATUS FILTER
    completed_calls = db.query(Call).filter(Call.status == CallStatus.CONNECTED).count()
    pending_calls = db.query(Call).filter(Call.status != CallStatus.CONNECTED).count()

    # ✅ FIX ENUM STATUS FILTER IN TOP PERFORMERS
    top_performers = (
        db.query(User.name, func.count(Call.id).label("completed_calls"))
        .join(Call, Call.assigned_to_id == User.id)
        .filter(Call.status == CallStatus.CONNECTED)
        .group_by(User.name)
        .order_by(func.count(Call.id).desc())
        .limit(5)
        .all()
    )

    status_distribution = (
        db.query(Call.status, func.count(Call.id))
        .group_by(Call.status)
        .all()
    )

    # Convert ENUM to string
    status_dict = {status.value: count for status, count in status_distribution}

    return {
        "total_calls": total_calls,
        "assigned_calls": assigned_calls,
        "unassigned_calls": unassigned_calls,
        "completed_calls": completed_calls,
        "pending_calls": pending_calls,
        "total_employees": total_employees,
        "top_performers": [
            {"name": name, "completed_calls": completed}
            for name, completed in top_performers
        ],
        "status_distribution": status_dict
    }