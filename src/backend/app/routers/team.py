from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.team import Team
from app.models.user import User, UserRole
from app.models.call import Call, CallStatus
from app.core.dependencies import require_manager, require_employee, get_current_user

router = APIRouter(prefix="/teams", tags=["teams"])


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


@router.get("/")
def get_teams(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return db.query(Team).all()


@router.patch("/assign")
def assign_employee(data: dict, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
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


@router.post("/assign-task")
def assign_task_to_team(
    data: dict,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    team_id = data.get("team_id")
    call_id = data.get("call_id")
    employee_id = data.get("employee_id")

    if current_user.role == UserRole.EMPLOYEE:
        if not current_user.team_id:
            raise HTTPException(status_code=400, detail="You are not assigned to any team")
        if team_id != current_user.team_id:
            raise HTTPException(status_code=403, detail="You can assign tasks only to your own team")

    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Task not found")

    team_members = db.query(User).filter(
        User.team_id == team_id,
        User.role == UserRole.EMPLOYEE
    ).all()

    if not team_members:
        raise HTTPException(status_code=400, detail="No employees in this team")

    if current_user.role == UserRole.EMPLOYEE:
        allowed_task = (
            call.team_id == current_user.team_id
            or call.assigned_to_id == current_user.id
        )
        if not allowed_task:
            raise HTTPException(status_code=403, detail="You can only assign your team tasks")

    if employee_id is not None:
        employee = next((member for member in team_members if member.id == employee_id), None)
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found in this team")
    else:
        employee = team_members[0]

    call.team_id = team_id
    call.assigned_to_id = employee.id
    db.commit()

    return {"message": f"Task assigned to {employee.name}"}


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

    members = db.query(User).filter(
        User.team_id == current_user.team_id,
        User.role == UserRole.EMPLOYEE
    ).all()

    total_tasks = db.query(Call).filter(Call.team_id == current_user.team_id).count()
    completed_tasks = db.query(Call).filter(
        Call.team_id == current_user.team_id,
        Call.status == CallStatus.CONNECTED
    ).count()
    pending_tasks = total_tasks - completed_tasks

    return {
        "team_id": team.id,
        "team_name": team.name,
        "members": [
            {
                "id": member.id,
                "name": member.name,
                "email": member.email,
                "phone": member.phone
            }
            for member in members
        ],
        "total_tasks": total_tasks,
        "pending_tasks": pending_tasks,
        "completed_tasks": completed_tasks
    }
