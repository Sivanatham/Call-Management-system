from pydantic import BaseModel
from datetime import datetime

class AuditLogResponse(BaseModel):
    id: int
    manager_id: int
    action_type: str
    details: str | None
    timestamp: datetime

    class Config:
        orm_mode = True
