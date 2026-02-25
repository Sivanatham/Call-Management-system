from fastapi import APIRouter, Depends, HTTPException, UploadFile, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from datetime import datetime
import pandas as pd

from app.db.database import get_db
from app.models.call import Call, CallStatus, Priority, Campaign
from app.models.user import User, UserRole
from app.models.audit import AuditLog
from app.schemas.call import CallCreate, CallResponse
from app.schemas.user import EmployeeListResponse
from app.core.dependencies import get_current_user, require_manager

router = APIRouter(prefix="/calls", tags=["calls"])


# =====================================================
# AUDIT HELPER
# =====================================================

def log_manager_action(db: Session, manager_id: int, action_type: str, details: str = None):
    audit = AuditLog(manager_id=manager_id, action_type=action_type, details=details)
    db.add(audit)
    db.commit()


# =====================================================
# GET ALL CALLS (Manager + Chief)
# =====================================================

@router.get("/", response_model=List[CallResponse])
def read_calls(
    status: CallStatus = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    query = db.query(Call)

    if status:
        query = query.filter(Call.status == status)

    return query.all()


# =====================================================
# EMPLOYEE - GET MY CALLS
# =====================================================

@router.get("/my", response_model=List[CallResponse])
def my_calls(db: Session = Depends(get_db), current_user=Depends(get_current_user)):

    if current_user.role == UserRole.MANAGER:
        return db.query(Call).all()

    if current_user.team_id:
        return db.query(Call).filter(
            (Call.assigned_to_id == current_user.id) |
            (Call.team_id == current_user.team_id)
        ).all()

    return db.query(Call).filter(Call.assigned_to_id == current_user.id).all()

@router.get("/my-progress")
def my_progress(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role == UserRole.MANAGER:
        query = db.query(Call)
    else:
        if current_user.team_id:
            query = db.query(Call).filter(
                (Call.assigned_to_id == current_user.id) |
                (Call.team_id == current_user.team_id)
            )
        else:
            query = db.query(Call).filter(
                Call.assigned_to_id == current_user.id
            )

    total_calls = query.count()
    completed_calls = query.filter(
        Call.status == CallStatus.CONNECTED
    ).count()

    pending_calls = query.filter(
        Call.status != CallStatus.CONNECTED
    ).count()

    calls = query.order_by(Call.id.desc()).limit(20).all()

    return {
        "total_calls": total_calls,
        "completed_calls": completed_calls,
        "pending_calls": pending_calls,
        "calls": calls
    }
# =====================================================
# UPDATE CALL STATUS (Employee / Manager)
# =====================================================

@router.patch("/{call_id}/update", response_model=CallResponse)
def update_call(
    call_id: int,
    status: str = Body(None),
    duration: int = Body(None),
    remarks: str = Body(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    call = db.query(Call).filter(Call.id == call_id).first()

    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    if status:
        mapped = status.upper()

        status_map = {
            "ATTENDED": CallStatus.CONNECTED,
            "CONNECTED": CallStatus.CONNECTED,
            "NOT_ATTENDED": CallStatus.FAILED,
            "FAILED": CallStatus.FAILED,
            "NOT_REACHABLE": CallStatus.CALLBACK_REQUIRED,
            "CALLBACK_REQUIRED": CallStatus.CALLBACK_REQUIRED,
            "PENDING": CallStatus.PENDING
        }

        if mapped not in status_map:
            raise HTTPException(status_code=400, detail=f"Invalid status: {mapped}")

        call.status = status_map[mapped]

    if duration is not None:
        call.duration = duration

    if remarks:
        call.remarks = remarks

    db.commit()
    db.refresh(call)

    return call

@router.post("/", response_model=CallResponse)
def create_call_api(
    call: CallCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # Validate priority safely
    try:
        priority_enum = Priority[call.priority.name] if isinstance(call.priority, Priority) else Priority[call.priority]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid priority")

    new_call = Call(
        customer_name=call.customer_name,
        phone=call.phone,
        priority=priority_enum,
        campaign=call.campaign,
        remarks=call.remarks,
        status=CallStatus.PENDING
    )

    db.add(new_call)
    db.commit()
    db.refresh(new_call)

    log_manager_action(
        db,
        manager_id=current_user.id,
        action_type="CREATE_CALL",
        details=f"Call {new_call.customer_name} created"
    )

    return new_call
# =====================================================
# CREATE CALL (Manager Only)
# =====================================================
# =====================================================
# BULK UPLOAD
# =====================================================

@router.post("/bulk")
def bulk_upload_calls(
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        df = pd.read_excel(file.file)

        required_columns = ["customer_name", "phone", "priority", "campaign"]

        # Check required columns
        for col in required_columns:
            if col not in df.columns:
                raise HTTPException(status_code=400, detail=f"Missing column: {col}")

        inserted = 0
        skipped_rows = []

        for index, row in df.iterrows():
            try:
                # Validate required fields
                if pd.isna(row["customer_name"]) or pd.isna(row["phone"]):
                    skipped_rows.append(f"Row {index+2}: Missing name or phone")
                    continue

                # Validate priority safely
                try:
                    priority_enum = Priority[str(row["priority"]).upper()]
                except:
                    skipped_rows.append(f"Row {index+2}: Invalid priority")
                    continue

                new_call = Call(
                    customer_name=row["customer_name"],
                    phone=str(row["phone"]),
                    priority=priority_enum,
                    campaign=row.get("campaign"),
                    remarks=row.get("remarks"),
                    status=CallStatus.PENDING
                )

                db.add(new_call)
                inserted += 1

            except Exception as e:
                skipped_rows.append(f"Row {index+2}: {str(e)}")

        db.commit()

        return {
            "message": "Upload completed",
            "inserted_rows": inserted,
            "skipped_count": len(skipped_rows),
            "skipped_details": skipped_rows
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
# =====================================================
# CREATE CALL (Manager Only)
# =====================================================

@router.post("/", response_model=CallResponse)
def create_call_api(
    call: CallCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # Allow only Manager & Employee
    if current_user.role not in [UserRole.MANAGER, UserRole.EMPLOYEE]:
        raise HTTPException(status_code=403, detail="Not allowed")

    try:
        priority_enum = Priority[call.priority]
    except KeyError:
        raise HTTPException(status_code=400, detail="Invalid priority")

    new_call = Call(
        customer_name=call.customer_name,
        phone=call.phone,
        priority=priority_enum,
        campaign=call.campaign,
        remarks=call.remarks,
        status=CallStatus.PENDING
    )

    # 🔥 If employee creates → assign to their team
    if current_user.role == UserRole.EMPLOYEE:
        new_call.team_id = current_user.team_id
        new_call.assigned_to_id = current_user.id  # optional: assign to self

    db.add(new_call)
    db.commit()
    db.refresh(new_call)

    return new_call





@router.delete("/clear-history")
def clear_history(
    db: Session = Depends(get_db),
    current_user=Depends(require_manager)
):

    deleted = db.query(Call).delete(synchronize_session=False)
    db.commit()

    return {
        "message": "All call history deleted successfully",
        "deleted_count": deleted
    }
# ===================




# ==================================
# DELETE CALL (Manager Only)
# =====================================================

@router.delete("/{call_id}")
def delete_call_api(
    call_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_manager)
):

    call = db.query(Call).filter(Call.id == call_id).first()

    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    db.delete(call)
    db.commit()

    return {"message": "Call deleted"}


@router.post("/assign-team/{team_id}")
def assign_calls_to_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role != UserRole.MANAGER:
        raise HTTPException(status_code=403, detail="Manager only")

    # Get employees in team
    employees = db.query(User).filter(
        User.team_id == team_id,
        User.role == UserRole.EMPLOYEE
    ).all()

    if not employees:
        raise HTTPException(status_code=400, detail="No employees in team")

    # Get ALL unassigned calls
    unassigned_calls = db.query(Call).filter(
        Call.assigned_to_id.is_(None)
    ).all()

    total_calls = len(unassigned_calls)
    num_employees = len(employees)

    if total_calls == 0:
        return {"message": "No unassigned calls"}

    # ROUND ROBIN DISTRIBUTION
    for index, call in enumerate(unassigned_calls):
        employee = employees[index % num_employees]
        call.assigned_to_id = employee.id

    db.commit()

    return {
        "message": "Calls distributed equally",
        "total_calls": total_calls,
        "employees": num_employees
    }

# =====================================================
# GET EMPLOYEES (Manager + Chief)
# =====================================================

@router.get("/employees", response_model=EmployeeListResponse)
def get_employees(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    if current_user.role not in [UserRole.MANAGER, UserRole.CHIEF]:
        raise HTTPException(status_code=403, detail="Access denied")

    employees = db.query(User).filter(User.role == UserRole.EMPLOYEE).all()

    return {
        "total": len(employees),
        "skip": 0,
        "limit": len(employees),
        "employees": employees
    }


# =====================================================
# ASSIGN CALL TO EMPLOYEE
# =====================================================

@router.patch("/{call_id}/assign")
def assign_call(
    call_id: int,
    employee_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    call = db.query(Call).filter(Call.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")

    employee = db.query(User).filter(
        User.id == employee_id,
        User.role == UserRole.EMPLOYEE
    ).first()

    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    call.assigned_to_id = employee.id
    db.commit()
    db.refresh(call)

    return {"message": f"Assigned to {employee.name}"}