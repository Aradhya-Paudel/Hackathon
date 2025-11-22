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
    
    # Special handling for National Monitor
    if current_user.get("office_name") == "National Monitor":
        # Get all applications
        all_applications = db.get_all_applications()
        
        # Calculate Gandaki data by summing all districts in Gandaki
        # This includes: Kaski (from municipalities), Baglung, Gorkha, Lamjung, Manang, Mustang, Myagdi, Nawalpur, Parbat, Syangja, Tanahun
        
        # Get Pokhara ward applications (for Kaski calculation)
        pokhara_ward_apps = [app for app in all_applications 
                            if app.get("target_office_level") == "local" 
                            and "Pokhara Ward Office" in app.get("target_office_name", "")]
        
        # Calculate Pokhara stats (sum of all ward applications)
        pokhara_total = len(pokhara_ward_apps)
        pokhara_completed = len([a for a in pokhara_ward_apps if a.get("status") == "Completed"])
        pokhara_pending = len([a for a in pokhara_ward_apps if a.get("status") in ["Submitted", "In Progress"]])
        pokhara_rejected = len([a for a in pokhara_ward_apps if a.get("status") == "Rejected" or a.get("approved") == False])
        pokhara_in_progress = len([a for a in pokhara_ward_apps if a.get("status") == "In Progress"])
        
        # Pokhara applications by type
        pokhara_apps_by_type = {}
        for app in pokhara_ward_apps:
            service_type = app.get("service_type", "unknown")
            pokhara_apps_by_type[service_type] = pokhara_apps_by_type.get(service_type, 0) + 1
        
        # Mock data for other municipalities in Kaski (same as used in Gandaki and Kaski monitors)
        annapurna_total = 324
        annapurna_completed = 278
        annapurna_pending = 38
        annapurna_rejected = 8
        annapurna_in_progress = 26
        annapurna_apps_by_type = {
            "national-id": 112,
            "birth-certificate": 98,
            "marriage-certificate": 76,
            "land-certificate": 38
        }
        
        machhapuchchhre_total = 267
        machhapuchchhre_completed = 221
        machhapuchchhre_pending = 35
        machhapuchchhre_rejected = 11
        machhapuchchhre_in_progress = 28
        machhapuchchhre_apps_by_type = {
            "national-id": 89,
            "birth-certificate": 82,
            "marriage-certificate": 63,
            "land-certificate": 33
        }
        
        madi_total = 198
        madi_completed = 167
        madi_pending = 24
        madi_rejected = 7
        madi_in_progress = 19
        madi_apps_by_type = {
            "national-id": 67,
            "birth-certificate": 58,
            "marriage-certificate": 47,
            "land-certificate": 26
        }
        
        rupa_total = 156
        rupa_completed = 128
        rupa_pending = 21
        rupa_rejected = 7
        rupa_in_progress = 16
        rupa_apps_by_type = {
            "national-id": 52,
            "birth-certificate": 47,
            "marriage-certificate": 38,
            "land-certificate": 19
        }
        
        # Calculate Kaski district total (sum of all municipalities)
        kaski_total = pokhara_total + annapurna_total + machhapuchchhre_total + madi_total + rupa_total
        kaski_completed = pokhara_completed + annapurna_completed + machhapuchchhre_completed + madi_completed + rupa_completed
        kaski_pending = pokhara_pending + annapurna_pending + machhapuchchhre_pending + madi_pending + rupa_pending
        kaski_rejected = pokhara_rejected + annapurna_rejected + machhapuchchhre_rejected + madi_rejected + rupa_rejected
        kaski_in_progress = pokhara_in_progress + annapurna_in_progress + machhapuchchhre_in_progress + madi_in_progress + rupa_in_progress
        
        # Mock data for other districts in Gandaki
        baglung_total = 1245
        baglung_completed = 1089
        baglung_pending = 132
        baglung_rejected = 24
        baglung_in_progress = 98
        
        gorkha_total = 1567
        gorkha_completed = 1342
        gorkha_pending = 178
        gorkha_rejected = 47
        gorkha_in_progress = 125
        
        lamjung_total = 987
        lamjung_completed = 856
        lamjung_pending = 108
        lamjung_rejected = 23
        lamjung_in_progress = 78
        
        manang_total = 234
        manang_completed = 198
        manang_pending = 28
        manang_rejected = 8
        manang_in_progress = 19
        
        mustang_total = 312
        mustang_completed = 267
        mustang_pending = 35
        mustang_rejected = 10
        mustang_in_progress = 24
        
        myagdi_total = 678
        myagdi_completed = 589
        myagdi_pending = 72
        myagdi_rejected = 17
        myagdi_in_progress = 54
        
        nawalpur_total = 1456
        nawalpur_completed = 1278
        nawalpur_pending = 145
        nawalpur_rejected = 33
        nawalpur_in_progress = 108
        
        parbat_total = 892
        parbat_completed = 768
        parbat_pending = 98
        parbat_rejected = 26
        parbat_in_progress = 71
        
        syangja_total = 1123
        syangja_completed = 967
        syangja_pending = 124
        syangja_rejected = 32
        syangja_in_progress = 89
        
        tanahun_total = 1345
        tanahun_completed = 1156
        tanahun_pending = 156
        tanahun_rejected = 33
        tanahun_in_progress = 112
        
        # Sum all districts in Gandaki to get Gandaki total
        gandaki_total = (kaski_total + baglung_total + gorkha_total + lamjung_total + 
                        manang_total + mustang_total + myagdi_total + nawalpur_total + 
                        parbat_total + syangja_total + tanahun_total)
        gandaki_completed = (kaski_completed + baglung_completed + gorkha_completed + lamjung_completed + 
                           manang_completed + mustang_completed + myagdi_completed + nawalpur_completed + 
                           parbat_completed + syangja_completed + tanahun_completed)
        gandaki_pending = (kaski_pending + baglung_pending + gorkha_pending + lamjung_pending + 
                         manang_pending + mustang_pending + myagdi_pending + nawalpur_pending + 
                         parbat_pending + syangja_pending + tanahun_pending)
        gandaki_rejected = (kaski_rejected + baglung_rejected + gorkha_rejected + lamjung_rejected + 
                          manang_rejected + mustang_rejected + myagdi_rejected + nawalpur_rejected + 
                          parbat_rejected + syangja_rejected + tanahun_rejected)
        gandaki_in_progress = (kaski_in_progress + baglung_in_progress + gorkha_in_progress + lamjung_in_progress + 
                              manang_in_progress + mustang_in_progress + myagdi_in_progress + nawalpur_in_progress + 
                              parbat_in_progress + syangja_in_progress + tanahun_in_progress)
        
        gandaki_efficiency = (gandaki_completed / gandaki_total * 100) if gandaki_total > 0 else 0
        
        # Calculate Gandaki avg processing time from Pokhara (real data)
        pokhara_completed_with_dates = [a for a in pokhara_ward_apps if a.get("status") == "Completed" and a.get("completed_date")]
        if pokhara_completed_with_dates:
            total_days = 0
            for a in pokhara_completed_with_dates:
                completed_str = a["completed_date"].replace('Z', '').replace('+00:00', '')
                submitted_str = a["submitted_date"].replace('Z', '').replace('+00:00', '')
                completed_dt = datetime.fromisoformat(completed_str)
                submitted_dt = datetime.fromisoformat(submitted_str)
                total_days += (completed_dt - submitted_dt).days
            gandaki_avg_time = total_days / len(pokhara_completed_with_dates)
        else:
            gandaki_avg_time = 3.5
        
        # Aggregate applications by type for all districts in Gandaki
        gandaki_apps_by_type = {}
        for app_type, count in pokhara_apps_by_type.items():
            gandaki_apps_by_type[app_type] = gandaki_apps_by_type.get(app_type, 0) + count
        for app_type, count in annapurna_apps_by_type.items():
            gandaki_apps_by_type[app_type] = gandaki_apps_by_type.get(app_type, 0) + count
        for app_type, count in machhapuchchhre_apps_by_type.items():
            gandaki_apps_by_type[app_type] = gandaki_apps_by_type.get(app_type, 0) + count
        for app_type, count in madi_apps_by_type.items():
            gandaki_apps_by_type[app_type] = gandaki_apps_by_type.get(app_type, 0) + count
        for app_type, count in rupa_apps_by_type.items():
            gandaki_apps_by_type[app_type] = gandaki_apps_by_type.get(app_type, 0) + count
        # Add mock types for other districts
        gandaki_apps_by_type["national-id"] = gandaki_apps_by_type.get("national-id", 0) + 2000
        gandaki_apps_by_type["birth-certificate"] = gandaki_apps_by_type.get("birth-certificate", 0) + 1700
        gandaki_apps_by_type["marriage-certificate"] = gandaki_apps_by_type.get("marriage-certificate", 0) + 1400
        gandaki_apps_by_type["land-certificate"] = gandaki_apps_by_type.get("land-certificate", 0) + 900
        
        # Generate mock data for other 6 provinces (for display only)
        # Nepal has 7 provinces: Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim
        subordinate_offices_data = [
            {
                "office_id": "province:Gandaki",
                "office_name": "Gandaki",
                "office_level": "province",
                "total_applications": gandaki_total,
                "completed": gandaki_completed,
                "pending": gandaki_pending,
                "rejected": gandaki_rejected,
                "in_progress": gandaki_in_progress,
                "efficiency": round(gandaki_efficiency, 2),
                "avg_processing_time": round(gandaki_avg_time, 1),
                "applications_by_type": gandaki_apps_by_type
            },
            {
                "office_id": "province:Koshi",
                "office_name": "Koshi",
                "office_level": "province",
                "total_applications": 15432,
                "completed": 13258,
                "pending": 1824,
                "rejected": 350,
                "in_progress": 1345,
                "efficiency": 85.9,
                "avg_processing_time": 4.3,
                "applications_by_type": {
                    "national-id": 5124,
                    "birth-certificate": 4421,
                    "marriage-certificate": 3645,
                    "land-certificate": 2242
                }
            },
            {
                "office_id": "province:Madhesh",
                "office_name": "Madhesh",
                "office_level": "province",
                "total_applications": 18765,
                "completed": 16089,
                "pending": 2134,
                "rejected": 542,
                "in_progress": 1587,
                "efficiency": 85.7,
                "avg_processing_time": 4.6,
                "applications_by_type": {
                    "national-id": 6234,
                    "birth-certificate": 5387,
                    "marriage-certificate": 4445,
                    "land-certificate": 2699
                }
            },
            {
                "office_id": "province:Bagmati",
                "office_name": "Bagmati",
                "office_level": "province",
                "total_applications": 23456,
                "completed": 20321,
                "pending": 2567,
                "rejected": 568,
                "in_progress": 1898,
                "efficiency": 86.6,
                "avg_processing_time": 4.1,
                "applications_by_type": {
                    "national-id": 7789,
                    "birth-certificate": 6723,
                    "marriage-certificate": 5545,
                    "land-certificate": 3399
                }
            },
            {
                "office_id": "province:Lumbini",
                "office_name": "Lumbini",
                "office_level": "province",
                "total_applications": 16789,
                "completed": 14321,
                "pending": 1987,
                "rejected": 481,
                "in_progress": 1476,
                "efficiency": 85.3,
                "avg_processing_time": 4.5,
                "applications_by_type": {
                    "national-id": 5578,
                    "birth-certificate": 4812,
                    "marriage-certificate": 3976,
                    "land-certificate": 2423
                }
            },
            {
                "office_id": "province:Karnali",
                "office_name": "Karnali",
                "office_level": "province",
                "total_applications": 8765,
                "completed": 7234,
                "pending": 1234,
                "rejected": 297,
                "in_progress": 912,
                "efficiency": 82.5,
                "avg_processing_time": 5.2,
                "applications_by_type": {
                    "national-id": 2912,
                    "birth-certificate": 2514,
                    "marriage-certificate": 2076,
                    "land-certificate": 1263
                }
            },
            {
                "office_id": "province:Sudurpashchim",
                "office_name": "Sudurpashchim",
                "office_level": "province",
                "total_applications": 11234,
                "completed": 9456,
                "pending": 1456,
                "rejected": 322,
                "in_progress": 1078,
                "efficiency": 84.2,
                "avg_processing_time": 4.8,
                "applications_by_type": {
                    "national-id": 3734,
                    "birth-certificate": 3223,
                    "marriage-certificate": 2661,
                    "land-certificate": 1616
                }
            }
        ]
        
        total_apps = sum([office["total_applications"] for office in subordinate_offices_data])
        completed_apps = sum([office["completed"] for office in subordinate_offices_data])
        overall_efficiency = (completed_apps / total_apps * 100) if total_apps > 0 else 0
        
        return {
            "monitor_office": current_user["office_name"],
            "monitor_level": monitor_level,
            "total_subordinates": len(subordinate_offices_data),
            "total_applications": total_apps,
            "overall_efficiency": round(overall_efficiency, 2),
            "subordinate_offices": subordinate_offices_data
        }
    
    # Special handling for Gandaki Province Monitor
    if current_user.get("office_name") == "Gandaki Province Monitor":
        # Get all applications
        all_applications = db.get_all_applications()
        
        # Calculate Kaski data by summing all municipalities in Kaski
        # This includes: Pokhara (from wards), Annapurna, Machhapuchchhre, Madi, Rupa
        # For Kaski, we need to sum all applications from municipalities in Kaski district
        
        # Get Pokhara ward applications
        pokhara_ward_apps = [app for app in all_applications 
                            if app.get("target_office_level") == "local" 
                            and "Pokhara Ward Office" in app.get("target_office_name", "")]
        
        # Calculate Pokhara stats (sum of all ward applications)
        pokhara_total = len(pokhara_ward_apps)
        pokhara_completed = len([a for a in pokhara_ward_apps if a.get("status") == "Completed"])
        pokhara_pending = len([a for a in pokhara_ward_apps if a.get("status") in ["Submitted", "In Progress"]])
        pokhara_rejected = len([a for a in pokhara_ward_apps if a.get("status") == "Rejected" or a.get("approved") == False])
        pokhara_in_progress = len([a for a in pokhara_ward_apps if a.get("status") == "In Progress"])
        
        # Pokhara applications by type
        pokhara_apps_by_type = {}
        for app in pokhara_ward_apps:
            service_type = app.get("service_type", "unknown")
            pokhara_apps_by_type[service_type] = pokhara_apps_by_type.get(service_type, 0) + 1
        
        # Mock data for other municipalities in Kaski (Annapurna, Machhapuchchhre, Madi, Rupa)
        # These are the same values used in Kaski District Monitor
        annapurna_total = 324
        annapurna_completed = 278
        annapurna_pending = 38
        annapurna_rejected = 8
        annapurna_in_progress = 26
        annapurna_apps_by_type = {
            "national-id": 112,
            "birth-certificate": 98,
            "marriage-certificate": 76,
            "land-certificate": 38
        }
        
        machhapuchchhre_total = 267
        machhapuchchhre_completed = 221
        machhapuchchhre_pending = 35
        machhapuchchhre_rejected = 11
        machhapuchchhre_in_progress = 28
        machhapuchchhre_apps_by_type = {
            "national-id": 89,
            "birth-certificate": 82,
            "marriage-certificate": 63,
            "land-certificate": 33
        }
        
        madi_total = 198
        madi_completed = 167
        madi_pending = 24
        madi_rejected = 7
        madi_in_progress = 19
        madi_apps_by_type = {
            "national-id": 67,
            "birth-certificate": 58,
            "marriage-certificate": 47,
            "land-certificate": 26
        }
        
        rupa_total = 156
        rupa_completed = 128
        rupa_pending = 21
        rupa_rejected = 7
        rupa_in_progress = 16
        rupa_apps_by_type = {
            "national-id": 52,
            "birth-certificate": 47,
            "marriage-certificate": 38,
            "land-certificate": 19
        }
        
        # Sum all municipalities in Kaski to get Kaski total
        kaski_total = pokhara_total + annapurna_total + machhapuchchhre_total + madi_total + rupa_total
        kaski_completed = pokhara_completed + annapurna_completed + machhapuchchhre_completed + madi_completed + rupa_completed
        kaski_pending = pokhara_pending + annapurna_pending + machhapuchchhre_pending + madi_pending + rupa_pending
        kaski_rejected = pokhara_rejected + annapurna_rejected + machhapuchchhre_rejected + madi_rejected + rupa_rejected
        kaski_in_progress = pokhara_in_progress + annapurna_in_progress + machhapuchchhre_in_progress + madi_in_progress + rupa_in_progress
        
        kaski_efficiency = (kaski_completed / kaski_total * 100) if kaski_total > 0 else 0
        
        # Calculate Kaski avg processing time from Pokhara (real data)
        pokhara_completed_with_dates = [a for a in pokhara_ward_apps if a.get("status") == "Completed" and a.get("completed_date")]
        if pokhara_completed_with_dates:
            total_days = 0
            for a in pokhara_completed_with_dates:
                completed_str = a["completed_date"].replace('Z', '').replace('+00:00', '')
                submitted_str = a["submitted_date"].replace('Z', '').replace('+00:00', '')
                completed_dt = datetime.fromisoformat(completed_str)
                submitted_dt = datetime.fromisoformat(submitted_str)
                total_days += (completed_dt - submitted_dt).days
            kaski_avg_time = total_days / len(pokhara_completed_with_dates)
        else:
            kaski_avg_time = 3.5
        
        # Aggregate applications by type for all municipalities in Kaski
        kaski_apps_by_type = {}
        for app_type, count in pokhara_apps_by_type.items():
            kaski_apps_by_type[app_type] = kaski_apps_by_type.get(app_type, 0) + count
        for app_type, count in annapurna_apps_by_type.items():
            kaski_apps_by_type[app_type] = kaski_apps_by_type.get(app_type, 0) + count
        for app_type, count in machhapuchchhre_apps_by_type.items():
            kaski_apps_by_type[app_type] = kaski_apps_by_type.get(app_type, 0) + count
        for app_type, count in madi_apps_by_type.items():
            kaski_apps_by_type[app_type] = kaski_apps_by_type.get(app_type, 0) + count
        for app_type, count in rupa_apps_by_type.items():
            kaski_apps_by_type[app_type] = kaski_apps_by_type.get(app_type, 0) + count
        
        # Generate mock data for other districts (for display only)
        # Gandaki Province has 11 districts: Baglung, Gorkha, Kaski, Lamjung, Manang, Mustang, Myagdi, Nawalpur, Parbat, Syangja, Tanahun
        subordinate_offices_data = [
            {
                "office_id": "district:Kaski",
                "office_name": "Kaski",
                "office_level": "district",
                "total_applications": kaski_total,
                "completed": kaski_completed,
                "pending": kaski_pending,
                "rejected": kaski_rejected,
                "in_progress": kaski_in_progress,
                "efficiency": round(kaski_efficiency, 2),
                "avg_processing_time": round(kaski_avg_time, 1),
                "applications_by_type": kaski_apps_by_type
            },
            {
                "office_id": "district:Baglung",
                "office_name": "Baglung",
                "office_level": "district",
                "total_applications": 1245,
                "completed": 1089,
                "pending": 132,
                "rejected": 24,
                "in_progress": 98,
                "efficiency": 87.5,
                "avg_processing_time": 4.3,
                "applications_by_type": {
                    "national-id": 412,
                    "birth-certificate": 356,
                    "marriage-certificate": 287,
                    "land-certificate": 190
                }
            },
            {
                "office_id": "district:Gorkha",
                "office_name": "Gorkha",
                "office_level": "district",
                "total_applications": 1567,
                "completed": 1342,
                "pending": 178,
                "rejected": 47,
                "in_progress": 125,
                "efficiency": 85.6,
                "avg_processing_time": 4.7,
                "applications_by_type": {
                    "national-id": 521,
                    "birth-certificate": 445,
                    "marriage-certificate": 367,
                    "land-certificate": 234
                }
            },
            {
                "office_id": "district:Lamjung",
                "office_name": "Lamjung",
                "office_level": "district",
                "total_applications": 987,
                "completed": 856,
                "pending": 108,
                "rejected": 23,
                "in_progress": 78,
                "efficiency": 86.7,
                "avg_processing_time": 4.1,
                "applications_by_type": {
                    "national-id": 328,
                    "birth-certificate": 284,
                    "marriage-certificate": 234,
                    "land-certificate": 141
                }
            },
            {
                "office_id": "district:Manang",
                "office_name": "Manang",
                "office_level": "district",
                "total_applications": 234,
                "completed": 198,
                "pending": 28,
                "rejected": 8,
                "in_progress": 19,
                "efficiency": 84.6,
                "avg_processing_time": 5.2,
                "applications_by_type": {
                    "national-id": 78,
                    "birth-certificate": 67,
                    "marriage-certificate": 55,
                    "land-certificate": 34
                }
            },
            {
                "office_id": "district:Mustang",
                "office_name": "Mustang",
                "office_level": "district",
                "total_applications": 312,
                "completed": 267,
                "pending": 35,
                "rejected": 10,
                "in_progress": 24,
                "efficiency": 85.6,
                "avg_processing_time": 5.5,
                "applications_by_type": {
                    "national-id": 104,
                    "birth-certificate": 89,
                    "marriage-certificate": 73,
                    "land-certificate": 46
                }
            },
            {
                "office_id": "district:Myagdi",
                "office_name": "Myagdi",
                "office_level": "district",
                "total_applications": 678,
                "completed": 589,
                "pending": 72,
                "rejected": 17,
                "in_progress": 54,
                "efficiency": 86.9,
                "avg_processing_time": 4.4,
                "applications_by_type": {
                    "national-id": 225,
                    "birth-certificate": 194,
                    "marriage-certificate": 160,
                    "land-certificate": 99
                }
            },
            {
                "office_id": "district:Nawalpur",
                "office_name": "Nawalpur",
                "office_level": "district",
                "total_applications": 1456,
                "completed": 1278,
                "pending": 145,
                "rejected": 33,
                "in_progress": 108,
                "efficiency": 87.8,
                "avg_processing_time": 4.0,
                "applications_by_type": {
                    "national-id": 484,
                    "birth-certificate": 418,
                    "marriage-certificate": 345,
                    "land-certificate": 209
                }
            },
            {
                "office_id": "district:Parbat",
                "office_name": "Parbat",
                "office_level": "district",
                "total_applications": 892,
                "completed": 768,
                "pending": 98,
                "rejected": 26,
                "in_progress": 71,
                "efficiency": 86.1,
                "avg_processing_time": 4.6,
                "applications_by_type": {
                    "national-id": 296,
                    "birth-certificate": 256,
                    "marriage-certificate": 211,
                    "land-certificate": 129
                }
            },
            {
                "office_id": "district:Syangja",
                "office_name": "Syangja",
                "office_level": "district",
                "total_applications": 1123,
                "completed": 967,
                "pending": 124,
                "rejected": 32,
                "in_progress": 89,
                "efficiency": 86.1,
                "avg_processing_time": 4.2,
                "applications_by_type": {
                    "national-id": 373,
                    "birth-certificate": 322,
                    "marriage-certificate": 266,
                    "land-certificate": 162
                }
            },
            {
                "office_id": "district:Tanahun",
                "office_name": "Tanahun",
                "office_level": "district",
                "total_applications": 1345,
                "completed": 1156,
                "pending": 156,
                "rejected": 33,
                "in_progress": 112,
                "efficiency": 86.0,
                "avg_processing_time": 4.5,
                "applications_by_type": {
                    "national-id": 447,
                    "birth-certificate": 386,
                    "marriage-certificate": 318,
                    "land-certificate": 194
                }
            }
        ]
        
        total_apps = sum([office["total_applications"] for office in subordinate_offices_data])
        completed_apps = sum([office["completed"] for office in subordinate_offices_data])
        overall_efficiency = (completed_apps / total_apps * 100) if total_apps > 0 else 0
        
        return {
            "monitor_office": current_user["office_name"],
            "monitor_level": monitor_level,
            "total_subordinates": len(subordinate_offices_data),
            "total_applications": total_apps,
            "overall_efficiency": round(overall_efficiency, 2),
            "subordinate_offices": subordinate_offices_data
        }
    
    # Special handling for Kaski District Monitor
    if current_user.get("office_name") == "Kaski District Monitor":
        # Get all applications
        all_applications = db.get_all_applications()
        
        # Calculate Pokhara data from all ward applications
        # Sum of all Pokhara ward applications = total applications for Pokhara
        pokhara_ward_apps = [app for app in all_applications 
                            if app.get("target_office_level") == "local" 
                            and "Pokhara Ward Office" in app.get("target_office_name", "")]
        
        # Calculate Pokhara stats (sum of all ward applications)
        pokhara_total = len(pokhara_ward_apps)  # Sum of all ward applications
        pokhara_completed = len([a for a in pokhara_ward_apps if a.get("status") == "Completed"])
        pokhara_pending = len([a for a in pokhara_ward_apps if a.get("status") in ["Submitted", "In Progress"]])
        pokhara_rejected = len([a for a in pokhara_ward_apps if a.get("status") == "Rejected" or a.get("approved") == False])
        pokhara_in_progress = len([a for a in pokhara_ward_apps if a.get("status") == "In Progress"])
        
        pokhara_efficiency = (pokhara_completed / pokhara_total * 100) if pokhara_total > 0 else 0
        
        # Calculate Pokhara avg processing time
        pokhara_completed_with_dates = [a for a in pokhara_ward_apps if a.get("status") == "Completed" and a.get("completed_date")]
        if pokhara_completed_with_dates:
            total_days = 0
            for a in pokhara_completed_with_dates:
                completed_str = a["completed_date"].replace('Z', '').replace('+00:00', '')
                submitted_str = a["submitted_date"].replace('Z', '').replace('+00:00', '')
                completed_dt = datetime.fromisoformat(completed_str)
                submitted_dt = datetime.fromisoformat(submitted_str)
                total_days += (completed_dt - submitted_dt).days
            pokhara_avg_time = total_days / len(pokhara_completed_with_dates)
        else:
            pokhara_avg_time = 3.5
        
        # Pokhara applications by type
        pokhara_apps_by_type = {}
        for app in pokhara_ward_apps:
            service_type = app.get("service_type", "unknown")
            pokhara_apps_by_type[service_type] = pokhara_apps_by_type.get(service_type, 0) + 1
        
        # Generate mock data for other municipalities (for display only)
        subordinate_offices_data = [
            {
                "office_id": "municipal:Pokhara",
                "office_name": "Pokhara",
                "office_level": "municipal",
                "total_applications": pokhara_total,
                "completed": pokhara_completed,
                "pending": pokhara_pending,
                "rejected": pokhara_rejected,
                "in_progress": pokhara_in_progress,
                "efficiency": round(pokhara_efficiency, 2),
                "avg_processing_time": round(pokhara_avg_time, 1),
                "applications_by_type": pokhara_apps_by_type
            },
            {
                "office_id": "municipal:Annapurna",
                "office_name": "Annapurna",
                "office_level": "municipal",
                "total_applications": 324,
                "completed": 278,
                "pending": 38,
                "rejected": 8,
                "in_progress": 26,
                "efficiency": 85.8,
                "avg_processing_time": 4.2,
                "applications_by_type": {
                    "national-id": 112,
                    "birth-certificate": 98,
                    "marriage-certificate": 76,
                    "land-certificate": 38
                }
            },
            {
                "office_id": "municipal:Machhapuchchhre",
                "office_name": "Machhapuchchhre",
                "office_level": "municipal",
                "total_applications": 267,
                "completed": 221,
                "pending": 35,
                "rejected": 11,
                "in_progress": 28,
                "efficiency": 82.8,
                "avg_processing_time": 4.8,
                "applications_by_type": {
                    "national-id": 89,
                    "birth-certificate": 82,
                    "marriage-certificate": 63,
                    "land-certificate": 33
                }
            },
            {
                "office_id": "municipal:Madi",
                "office_name": "Madi",
                "office_level": "municipal",
                "total_applications": 198,
                "completed": 167,
                "pending": 24,
                "rejected": 7,
                "in_progress": 19,
                "efficiency": 84.3,
                "avg_processing_time": 4.5,
                "applications_by_type": {
                    "national-id": 67,
                    "birth-certificate": 58,
                    "marriage-certificate": 47,
                    "land-certificate": 26
                }
            },
            {
                "office_id": "municipal:Rupa",
                "office_name": "Rupa",
                "office_level": "municipal",
                "total_applications": 156,
                "completed": 128,
                "pending": 21,
                "rejected": 7,
                "in_progress": 16,
                "efficiency": 82.1,
                "avg_processing_time": 5.1,
                "applications_by_type": {
                    "national-id": 52,
                    "birth-certificate": 47,
                    "marriage-certificate": 38,
                    "land-certificate": 19
                }
            }
        ]
        
        total_apps = sum([office["total_applications"] for office in subordinate_offices_data])
        completed_apps = sum([office["completed"] for office in subordinate_offices_data])
        overall_efficiency = (completed_apps / total_apps * 100) if total_apps > 0 else 0
        
        return {
            "monitor_office": current_user["office_name"],
            "monitor_level": monitor_level,
            "total_subordinates": len(subordinate_offices_data),
            "total_applications": total_apps,
            "overall_efficiency": round(overall_efficiency, 2),
            "subordinate_offices": subordinate_offices_data
        }
    
    # Original logic for other monitors
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

