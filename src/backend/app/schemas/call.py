from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.call import CallStatus, Priority

class CallBase(BaseModel):
    customer_name: str
    phone: str
    priority: Optional[Priority] = None
    campaign: Optional[str] = None  # dynamic
    remarks: Optional[str] = None

class CallCreate(CallBase):
    assigned_to_id: Optional[int] = None

class CallResponse(BaseModel):
    id: int
    customer_name: str
    phone: str
    status: CallStatus
    priority: Optional[Priority]
    campaign: Optional[str]
    remarks: Optional[str]
    start_time: Optional[datetime]  # <-- change from str to datetime
    end_time: Optional[datetime]    # <-- change from str to datetime
    duration: Optional[int]
    call_result: Optional[str]
    assigned_to_id: Optional[int]

    class Config:
        from_attributes = True# <-- important for from_orm in Pydantic v2

# For adding a new campaign
class CampaignCreate(BaseModel):
    name: str