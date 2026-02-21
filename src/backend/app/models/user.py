from sqlalchemy import Column, Integer, String, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base
import enum

class UserRole(str, enum.Enum):
    MANAGER = "manager"
    EMPLOYEE = "employee"
    CHIEF = "chief"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(Enum(UserRole), nullable=False)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    
    calls = relationship("Call", back_populates="assigned_to_user")
    audit_logs = relationship("AuditLog", back_populates="manager")
    team = relationship("Team", backref="members")
