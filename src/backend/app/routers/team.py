from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.team import Team
from app.models.user import User, UserRole
from app.models.call import Call
from app.core.dependencies import require_manager, require_employee

router = APIRouter(prefix="/teams", tags=["teams"])


# =========================
# Create Team
# =========================
@router.post("/")
def create_team(data: dict, db: Session = Depends(get_db), current_user=Depends(require_manager)):
    name = data.get("name")

    existing = db.query(Team).filter(Team.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Team already exists")

    team = Team(name=name)
    db.add(team)
    db.commit()
    db.refresh(team)

    return team


# =========================
# Get All Teams
# =========================
@router.get("/")
def get_teams(db: Session = Depends(get_db), current_user=Depends(require_manager)):
    return db.query(Team).all()


# =========================
# Assign Employee To Team
# =========================
@router.patch("/assign")
def assign_employee(data: dict, db: Session = Depends(get_db), current_user=Depends(require_manager)):
    team_id = data.get("team_id")
    employee_id = data.get("employee_id")

    employee = db.query(User).filter(
        User.id == employee_id,
        User.role == UserRole.EMPLOYEE
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee.team_id = team_id
    db.commit()

    return {"message": "Employee assigned successfully"}


# =========================
# Assign Task To Team
# =========================
@router.post("/assign-task")
def assign_task_to_team(
    data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(require_manager)
):
    team_id = data.get("team_id")
    call_id = data.get("call_id")

    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Task not found")

    # 🔥 Get employees in that team
    team_members = db.query(User).filter(
        User.team_id == team_id,
        User.role == UserRole.EMPLOYEE
    ).all()

    if not team_members:
        raise HTTPException(status_code=400, detail="No employees in this team")

    # Assign to first employee
    employee = team_members[0]

    call.team_id = team_id
    call.assigned_to_id = employee.id   # 🔥 THIS WAS MISSING

    db.commit()

    return {
        "message": f"Task assigned to {employee.name}"
    }


# =========================
# Get Team Info (for employees)
# =========================
from app.models.call import CallStatus

@router.get("/my-team")
def get_my_team(
    db: Session = Depends(get_db),
    current_user=Depends(require_employee)
):
    if not current_user.team_id:
        raise HTTPException(status_code=404, detail="You are not assigned to any team")

    team = db.query(Team).filter(Team.id == current_user.team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Get team members
    members = db.query(User).filter(
        User.team_id == current_user.team_id,
        User.role == UserRole.EMPLOYEE
    ).all()

    # 🔥 PROPER COUNTING USING ENUM (NO STRING COMPARISON)
    total_tasks = db.query(Call).filter(
        Call.team_id == current_user.team_id
    ).count()

    completed_tasks = db.query(Call).filter(
        Call.team_id == current_user.team_id,
        Call.status == CallStatus.CONNECTED
    ).count()

    # Everything not connected = pending
    pending_tasks = total_tasks - completed_tasks

    return {
        "team_id": team.id,
        "team_name": team.name,
        "members": [{
            "id": m.id,
            "name": m.name,
            "email": m.email,
            "phone": m.phone
        } for m in members],
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks
    }