from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
import uuid
from typing import List
import random

from models import (
    UserCreate, UserLogin, User, Token,
    ApplicationCreate, ApplicationUpdate, Application,
    OfficeStats, MessageCreate, Message,
    HierarchyStats, SubordinateOfficeStats
)
from database import db
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, require_official
)

app = FastAPI(
    title="Sarkaha Government Portal API",
    description="Backend API for Nepal Government Monitoring System",
    version="1.0.0"
)

# CORS configuration for frontend (allow local network access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173",
        "http://192.168.88.223:5173",
    ],
    allow_origin_regex=r"http://192\.168\.\d+\.\d+:\d+",  # Allow any local IP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============= AUTH ROUTES =============

@app.post("/api/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user (citizen or official)
    """
    # Check if user already exists
    existing_user = db.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate official data
    if user_data.user_type == "official":
        if not user_data.office_level or not user_data.office_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Officials must provide office_level and office_name"
            )
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)
    
    user = {
        "id": user_id,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "phone": user_data.phone,
        "user_type": user_data.user_type,
        "hashed_password": hashed_password,
        "created_at": datetime.utcnow().isoformat(),
        "citizenship_number": user_data.citizenship_number,
        "office_level": user_data.office_level,
        "office_name": user_data.office_name
    }
    
    db.create_user(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    # Remove password from response
    user_response = {k: v for k, v in user.items() if k != "hashed_password"}
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@app.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    """
    Login a user
    """
    user = db.get_user_by_email(credentials.email)
    
    if not user or not verify_password(credentials.password, user.get("hashed_password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["id"]})
    
    # Remove password from response
    user_response = {k: v for k, v in user.items() if k != "hashed_password"}
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@app.get("/api/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Get current user info
    """
    return {k: v for k, v in current_user.items() if k != "hashed_password"}

# ============= APPLICATION ROUTES =============

@app.post("/api/applications", response_model=Application, status_code=status.HTTP_201_CREATED)
async def create_application(
    app_data: ApplicationCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Submit a new application
    """
    app_id = "APP" + str(uuid.uuid4())[:8].upper()
    
    # Calculate estimated days (simple random for now, will be ML model later)
    estimated_days = random.randint(3, 7)
    
    application = {
        "id": app_id,
        "full_name": app_data.full_name,
        "email": app_data.email,
        "phone": app_data.phone,
        "address": app_data.address,
        "service_type": app_data.service_type,
        "citizenship_number": app_data.citizenship_number,
        "description": app_data.description,
        "target_office_level": app_data.target_office_level,
        "target_office_name": app_data.target_office_name,
        "submitted_date": datetime.utcnow().isoformat(),
        "status": "Submitted",
        "current_stage": "Document Verification",
        "estimated_days": estimated_days,
        "progress": 10,
        "user_id": current_user["id"]
    }
    
    db.create_application(application)
    
    return application

@app.get("/api/applications/{application_id}", response_model=Application)
async def get_application(application_id: str):
    """
    Get application by ID (public endpoint for tracking)
    """
    application = db.get_application_by_id(application_id)
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    return application

@app.get("/api/applications", response_model=List[Application])
async def get_my_applications(current_user: dict = Depends(get_current_user)):
    """
    Get all applications for current user
    """
    applications = db.get_applications_by_user(current_user["id"])
    return applications

@app.put("/api/applications/{application_id}", response_model=Application)
async def update_application(
    application_id: str,
    update_data: ApplicationUpdate,
    current_user: dict = Depends(require_official)
):
    """
    Update application status (officials only)
    """
    application = db.get_application_by_id(application_id)
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check if official has access to this application
    if (application.get("target_office_level") != current_user.get("office_level") or
        application.get("target_office_name") != current_user.get("office_name")):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this application"
        )
    
    # Update application
    updates = {k: v for k, v in update_data.dict().items() if v is not None}
    updated_app = db.update_application(application_id, updates)
    
    return updated_app

@app.delete("/api/applications/{application_id}")
async def delete_application(
    application_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete an application (officials only)
    """
    # Only officials can delete
    if current_user.get("user_type") != "official":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officials can delete applications"
        )
    
    application = db.get_application_by_id(application_id)
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Check if official has permission (same office)
    if (application.get("target_office_level") != current_user.get("office_level") or
        application.get("target_office_name") != current_user.get("office_name")):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this application"
        )
    
    # Delete application
    success = db.delete_application(application_id)
    
    if success:
        return {"message": "Application deleted successfully", "id": application_id}
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete application"
        )

# ============= OFFICIAL/HIERARCHY ROUTES =============

@app.get("/api/office/applications", response_model=List[Application])
async def get_office_applications(current_user: dict = Depends(require_official)):
    """
    Get all applications for current official's office
    """
    applications = db.get_applications_by_office(
        current_user["office_level"],
        current_user["office_name"]
    )
    return applications

@app.get("/api/office/stats", response_model=OfficeStats)
async def get_office_stats(current_user: dict = Depends(require_official)):
    """
    Get statistics for current official's office
    """
    applications = db.get_applications_by_office(
        current_user["office_level"],
        current_user["office_name"]
    )
    
    total = len(applications)
    completed = len([app for app in applications if app.get("status") == "Approved"])
    pending = len([app for app in applications if app.get("status") in ["Submitted", "In Progress"]])
    
    efficiency = (completed / total * 100) if total > 0 else 0
    avg_processing_time = 3.5  # Mock data for now
    
    return {
        "office_level": current_user["office_level"],
        "office_name": current_user["office_name"],
        "total_applications": total,
        "completed": completed,
        "pending": pending,
        "efficiency": round(efficiency, 2),
        "avg_processing_time": avg_processing_time
    }

@app.get("/api/hierarchy/subordinates")
async def get_subordinate_offices(current_user: dict = Depends(require_official)):
    """
    Get statistics for all subordinate offices
    """
    # Mock data for now - will implement proper hierarchy later
    subordinate_offices = [
        {"name": "Ward 1 Office", "applications": 45, "completed": 38, "efficiency": 84},
        {"name": "Ward 2 Office", "applications": 52, "completed": 41, "efficiency": 79},
        {"name": "Ward 3 Office", "applications": 38, "completed": 35, "efficiency": 92},
        {"name": "Ward 4 Office", "applications": 29, "completed": 22, "efficiency": 76},
        {"name": "Ward 5 Office", "applications": 41, "completed": 39, "efficiency": 95}
    ]
    
    return subordinate_offices

# ============= HIERARCHY MONITORING ROUTES =============

@app.get("/api/monitor/hierarchy-stats", response_model=HierarchyStats)
async def get_hierarchy_stats(current_user: dict = Depends(require_official)):
    """
    Get comprehensive hierarchy statistics for monitoring accounts
    """
    if not current_user.get("is_monitor"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only monitoring accounts can access this endpoint"
        )
    
    monitor_level = current_user["office_level"]
    monitored_levels = current_user.get("monitors", [])
    
    # Get all applications
    all_applications = db.get_all_applications()
    
    # Get all officials to find all subordinate offices
    all_officials = [u for u in db.get_all_users() if u.get("user_type") == "official"]
    
    # Create a map of all subordinate offices
    subordinate_office_ids = {}
    
    # First, collect all subordinate offices from officials database
    for official in all_officials:
        office_level = official.get("office_level")
        office_name = official.get("office_name")
        
        # Check if this office is monitored and not a monitor account itself
        if office_level in monitored_levels and not official.get("is_monitor"):
            office_key = f"{office_level}:{office_name}"
            if office_key not in subordinate_office_ids:
                subordinate_office_ids[office_key] = {
                    "office_name": office_name,
                    "office_level": office_level,
                    "applications": []
                }
    
    # Now assign applications to their respective offices
    for app in all_applications:
        office_level = app.get("target_office_level")
        office_name = app.get("target_office_name")
        office_key = f"{office_level}:{office_name}"
        
        # Add application to office if it exists in our subordinate offices
        if office_key in subordinate_office_ids:
            subordinate_office_ids[office_key]["applications"].append(app)
    
    # Calculate stats for each office
    subordinate_offices_data = []
    for office_key, office_data in subordinate_office_ids.items():
        apps = office_data["applications"]
        total = len(apps)
        completed = len([a for a in apps if a.get("status") == "Completed"])
        pending = len([a for a in apps if a.get("status") in ["Submitted", "In Progress"]])
        rejected = len([a for a in apps if a.get("status") == "Rejected" or a.get("approved") == False])
        in_progress = len([a for a in apps if a.get("status") == "In Progress"])
        
        efficiency = (completed / total * 100) if total > 0 else 0
        
        # Calculate avg processing time
        completed_with_dates = [a for a in apps if a.get("status") == "Completed" and a.get("completed_date")]
        if completed_with_dates:
            total_days = 0
            for a in completed_with_dates:
                completed_str = a["completed_date"].replace('Z', '').replace('+00:00', '')
                submitted_str = a["submitted_date"].replace('Z', '').replace('+00:00', '')
                completed_dt = datetime.fromisoformat(completed_str)
                submitted_dt = datetime.fromisoformat(submitted_str)
                total_days += (completed_dt - submitted_dt).days
            avg_time = total_days / len(completed_with_dates)
        else:
            avg_time = 0
        
        # Applications by type
        apps_by_type = {}
        for app in apps:
            service_type = app.get("service_type", "unknown")
            apps_by_type[service_type] = apps_by_type.get(service_type, 0) + 1
        
        subordinate_offices_data.append({
            "office_id": office_key,
            "office_name": office_data["office_name"],
            "office_level": office_data["office_level"],
            "total_applications": total,
            "completed": completed,
            "pending": pending,
            "rejected": rejected,
            "in_progress": in_progress,
            "efficiency": round(efficiency, 2),
            "avg_processing_time": round(avg_time, 1),
            "applications_by_type": apps_by_type
        })
    
    # Calculate overall stats
    total_apps = len([app for app in all_applications 
                      if app.get("target_office_level") in monitored_levels])
    completed_apps = len([app for app in all_applications 
                          if app.get("target_office_level") in monitored_levels 
                          and app.get("status") == "Completed"])
    overall_efficiency = (completed_apps / total_apps * 100) if total_apps > 0 else 0
    
    return {
        "monitor_office": current_user["office_name"],
        "monitor_level": monitor_level,
        "total_subordinates": len(subordinate_offices_data),
        "total_applications": total_apps,
        "overall_efficiency": round(overall_efficiency, 2),
        "subordinate_offices": subordinate_offices_data
    }

# ============= MESSAGING ROUTES =============

@app.post("/api/messages", response_model=Message)
async def send_message(
    message_data: MessageCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Send a message to another official
    """
    if current_user.get("user_type") != "official":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only officials can send messages"
        )
    
    # Create message
    message = {
        "id": str(uuid.uuid4()),
        "sender_id": current_user["id"],
        "sender_office": current_user["office_name"],
        "sender_name": current_user["full_name"],
        "recipient_id": message_data.recipient_id,
        "recipient_office": message_data.recipient_office,
        "subject": message_data.subject,
        "content": message_data.content,
        "priority": message_data.priority,
        "created_at": datetime.utcnow().isoformat(),
        "read": False
    }
    
    db.create_message(message)
    return message

@app.get("/api/messages/received", response_model=List[Message])
async def get_received_messages(current_user: dict = Depends(get_current_user)):
    """
    Get all messages received by current user
    """
    messages = db.get_received_messages(current_user["id"])
    # Sort by created_at descending
    messages.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return messages

@app.get("/api/messages/sent", response_model=List[Message])
async def get_sent_messages(current_user: dict = Depends(get_current_user)):
    """
    Get all messages sent by current user
    """
    messages = db.get_sent_messages(current_user["id"])
    messages.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return messages

@app.put("/api/messages/{message_id}/read")
async def mark_message_as_read(
    message_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Mark a message as read
    """
    message = db.get_message_by_id(message_id)
    
    if not message:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    
    if message.get("recipient_id") != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only mark your own messages as read"
        )
    
    updated_message = db.mark_message_read(message_id)
    return updated_message

@app.get("/api/officials", response_model=List[User])
async def get_all_officials(current_user: dict = Depends(require_official)):
    """
    Get list of all officials (for messaging)
    """
    officials = [user for user in db.get_all_users() if user.get("user_type") == "official"]
    return officials

# ============= HEALTH CHECK =============

@app.get("/")
async def root():
    """
    Health check endpoint
    """
    return {
        "message": "Sarkaha Government Portal API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health():
    """
    Health check
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

