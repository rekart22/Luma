import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import requests
from datetime import datetime
from dotenv import load_dotenv

# Import our custom logger
from utils.logger import logger

# Import routers
from routers.chat import router as chat_router

# Load environment variables from .env file in the parent directory of luma-therapy
DOTENV_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

# Try to load .env and log the result
load_dotenv_success = load_dotenv(dotenv_path=DOTENV_PATH)
logger.info(f"Loaded .env from {DOTENV_PATH}: {load_dotenv_success}")

# Check for required environment variables
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    logger.warning("OPENAI_API_KEY not found in environment variables")

# Map .env variable SUPABASE_API_KEY to SUPABASE_SERVICE_ROLE_KEY for code clarity
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_API_KEY")

app = FastAPI(
    title="Luma Therapy API",
    description="FastAPI backend for Luma Therapy Chat",
    version="1.0.0"
)

# Welcome endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Luma Therapy API",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "chat": {
                "completion": "/chat/completion",
                "stream": "/chat/stream"
            },
            "auth": {
                "change_password": "/auth/change-password",
                "change_password_audit": "/auth/change-password-audit"
            }
        }
    }

# Allow CORS for local dev and production
# TODO: Replace "https://your-production-domain.com" with your actual production domain
ALLOWED_ORIGINS = [
    "http://localhost:3000", # Next.js default dev port
    "http://127.0.0.1:3000",
    "http://localhost:3004", # As per original config, keeping it just in case
    "http://127.0.0.1:3004",
    "https://your-production-domain.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router)

class PasswordChangeRequest(BaseModel):
    user_id: str = Field(..., description="User's UUID")
    old_password: str = Field(..., description="Current password")
    new_password: str = Field(..., description="New password")
    trace_id: str = Field(..., description="Trace ID for audit logging")

class PasswordAuditLogRequest(BaseModel):
    user_id: str = Field(..., description="User's UUID")
    event_type: str = Field(..., description="Event type, e.g. password_change or password_setup")
    trace_id: str = Field(None, description="Trace ID for audit logging")
    meta: dict = Field(None, description="Optional metadata for the event")

@app.post("/auth/change-password")
async def change_password(req: PasswordChangeRequest):
    # TODO: Implement actual password verification with Supabase.
    # This should involve securely checking req.old_password.
    # TODO: Implement actual password change with Supabase Admin API.
    # This should securely set req.new_password for req.user_id.
    logger.info(f"Password change attempt", req.dict(exclude={"old_password", "new_password"}))
    
    # TODO: Enhance audit log:
    # - Include IP address of the requester.
    # - Include User-Agent string.
    # - Consider logging if the old_password verification succeeded or failed.
    audit_payload = {
        "user_id": req.user_id,
        "event_type": "password_change_attempt", # Changed to reflect it's an attempt until verified
        "event_time": datetime.utcnow().isoformat(),
        "trace_id": req.trace_id,
        "meta": {"status": "mock_success"} # TODO: Update status based on actual outcome
    }
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/auth_audit_log",
        json=audit_payload,
        headers=headers
    )
    logger.info(f"Supabase REST API response: status={resp.status_code}, text={resp.text}")
    if resp.status_code not in (200, 201):
        logger.error(f"Failed to insert audit log: {resp.text}")
        raise HTTPException(status_code=500, detail="Failed to log audit event")
    logger.info(f"Password change logged to Supabase", {"user_id": req.user_id, "trace_id": req.trace_id})
    return {"status": "ok", "message": "Password changed and logged (mocked)"}

@app.post("/auth/change-password-audit")
async def change_password_audit(req: PasswordAuditLogRequest):
    logger.info(f"Received password audit log event", req.dict())
    
    audit_payload = {
        "user_id": req.user_id,
        "event_type": req.event_type,
        "event_time": datetime.utcnow().isoformat(),
        "trace_id": req.trace_id,
        "meta": req.meta or {},
    }
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    # Debug: log the actual URL being constructed
    full_url = f"{SUPABASE_URL}/rest/v1/auth_audit_log"
    
    resp = requests.post(
        full_url,
        json=audit_payload,
        headers=headers
    )
    logger.info(f"Supabase REST API response: status={resp.status_code}, text={resp.text}")
    if resp.status_code not in (200, 201):
        logger.error(f"Failed to insert audit log: {resp.text}")
        raise HTTPException(status_code=500, detail="Failed to log audit event")
    logger.info(f"Password audit event logged to Supabase", {"user_id": req.user_id, "trace_id": req.trace_id})
    return {"status": "ok", "message": "Password audit event logged"} 