from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.audit import AuditLog
from app.core.dependencies import require_manager

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("/")
def get_audit_logs(db: Session = Depends(get_db), current_user=Depends(require_manager)):
    """
    Get all audit logs for the logged-in manager
    """
    logs = db.query(AuditLog).filter(AuditLog.manager_id == current_user.id).order_by(AuditLog.timestamp.desc()).all()

    return [
        {
            "id": log.id,
            "action_type": log.action_type,
            "details": log.details,
            "timestamp": log.timestamp
        }
        for log in logs
    ]