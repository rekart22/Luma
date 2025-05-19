import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from loguru import logger
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file in the parent directory of luma-therapy
DOTENV_PATH = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'))

# Debug prints for .env loading
logger.debug(f"Current working directory: {os.getcwd()}")
logger.debug(f"Looking for .env file at: {DOTENV_PATH}")
logger.debug(f"Does .env file exist? {os.path.exists(DOTENV_PATH)}")

# Try to load .env and log the result
load_dotenv_success = load_dotenv(dotenv_path=DOTENV_PATH)
logger.debug(f"Was .env file loaded successfully? {load_dotenv_success}")

# Map .env variable SUPABASE_API_KEY to SUPABASE_SERVICE_ROLE_KEY for code clarity
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_API_KEY")

# Debug prints for environment variables
logger.debug(f"SUPABASE_URL loaded as: {'[SET]' if SUPABASE_URL else '[NOT SET]'}")
logger.debug(f"SUPABASE_SERVICE_ROLE_KEY loaded as: {'[SET]' if SUPABASE_SERVICE_ROLE_KEY else '[NOT SET]'}")

app = FastAPI()

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3004", "http://127.0.0.1:3004", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
    # --- MOCK password verification and change ---
    # In production, verify old_password and change via Supabase Admin API
    logger.info(f"Password change attempt", req.dict(exclude={"old_password", "new_password"}))
    # --- Insert audit log into Supabase ---
    audit_payload = {
        "user_id": req.user_id,
        "event_type": "password_change",
        "event_time": datetime.utcnow().isoformat(),
        "trace_id": req.trace_id,
        "meta": {"status": "success"}
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
    
    # Debug: verify environment variables during request
    logger.debug(f"During request - SUPABASE_URL: {'[SET]' if SUPABASE_URL else '[NOT SET]'}")
    logger.debug(f"During request - SUPABASE_SERVICE_ROLE_KEY: {'[SET]' if SUPABASE_SERVICE_ROLE_KEY else '[NOT SET]'}")
    
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
    logger.debug(f"Attempting to call Supabase URL: {full_url}")
    
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