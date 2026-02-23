from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.call import CallStatus, Priority


# =====================================
# BASE
# =====================================

class CallBase(BaseModel):
    customer_name: str
    phone: str
    priority: Priority
    campaign: str
    remarks: Optional[str] = None


# =====================================
# CREATE
# =====================================

class CallCreate(CallBase):
    assigned_to_id: Optional[int] = None


# =====================================
# RESPONSE
# =====================================

class CallResponse(BaseModel):
    id: int
    customer_name: str
    phone: str
    status: CallStatus
    priority: Optional[Priority]
    campaign: Optional[str]
    remarks: Optional[str]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    duration: Optional[int]
    call_result: Optional[str]
    assigned_to_id: Optional[int]

    class Config:
        from_attributes = True  # Pydantic v2


# =====================================
# CAMPAIGN CREATE
# =====================================

class CampaignCreate(BaseModel):
    name: str