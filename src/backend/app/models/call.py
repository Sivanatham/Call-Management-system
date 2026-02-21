from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum
from datetime import datetime

class CallStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONNECTED = "CONNECTED"
    FAILED = "FAILED"
    CALLBACK_REQUIRED = "CALLBACK_REQUIRED"

# Predefined priorities
class Priority(str, enum.Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

# Predefined campaigns
class Campaign(str, enum.Enum):
    WEST_REGION = "West Region"
    EAST_REGION = "East Region"
    SALES_CAMPAIGN = "Sales Campaign"

class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    status = Column(Enum(CallStatus), default=CallStatus.PENDING)
    priority = Column(Enum(Priority), nullable=True)
    campaign = Column(String, nullable=True)  # dynamic campaigns
    remarks = Column(String, nullable=True)
    start_time = Column(DateTime, nullable=True)
    end_time = Column(DateTime, nullable=True)
    duration = Column(Integer, nullable=True)
    call_result = Column(String, nullable=True)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)

    assigned_to_user = relationship("User", back_populates="calls")
