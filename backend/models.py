from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime

# User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: str
    user_type: Literal["citizen", "official"]

class UserCreate(UserBase):
    password: str
    citizenship_number: Optional[str] = None
    office_level: Optional[Literal["local", "metropolitan", "district", "province", "national"]] = None
    office_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str
    created_at: datetime
    office_level: Optional[str] = None
    office_name: Optional[str] = None
    citizenship_number: Optional[str] = None
    is_monitor: Optional[bool] = None
    monitors: Optional[list[str]] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# Application Models
class ApplicationCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    address: str
    service_type: str
    citizenship_number: str
    description: Optional[str] = None
    target_office_level: str
    target_office_name: str

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    current_stage: Optional[str] = None
    progress: Optional[int] = None
    rejection_message: Optional[str] = None
    approved: Optional[bool] = None
    completed_date: Optional[str] = None

class Application(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    phone: str
    address: str
    service_type: str
    citizenship_number: Optional[str] = None
    description: Optional[str] = None
    target_office_level: str
    target_office_name: str
    submitted_date: datetime
    status: str
    current_stage: str
    estimated_days: int
    progress: Optional[int] = 0
    user_id: str
    approved: Optional[bool] = None
    rejection_message: Optional[str] = None
    completed_date: Optional[str] = None

# Office/Hierarchy Models
class OfficeStats(BaseModel):
    office_level: str
    office_name: str
    total_applications: int
    completed: int
    pending: int
    efficiency: float
    avg_processing_time: float

# Message Models
class MessageCreate(BaseModel):
    recipient_id: str
    recipient_office: str
    subject: str
    content: str
    priority: Optional[Literal["low", "medium", "high", "urgent"]] = "medium"

class Message(BaseModel):
    id: str
    sender_id: str
    sender_office: str
    sender_name: str
    recipient_id: str
    recipient_office: str
    subject: str
    content: str
    priority: str
    created_at: datetime
    read: bool = False

# Hierarchy Stats Models
class SubordinateOfficeStats(BaseModel):
    office_id: str
    office_name: str
    office_level: str
    total_applications: int
    completed: int
    pending: int
    rejected: int
    in_progress: int
    efficiency: float
    avg_processing_time: float
    applications_by_type: dict

class HierarchyStats(BaseModel):
    monitor_office: str
    monitor_level: str
    total_subordinates: int
    total_applications: int
    overall_efficiency: float
    subordinate_offices: list[SubordinateOfficeStats]

