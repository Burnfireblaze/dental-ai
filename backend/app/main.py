from __future__ import annotations

import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from .settings import settings, ensure_directories
from . import storage
from .jobs import JobManager
from .schemas import (
    AnalyzeResponse,
    JobStatus,
    CaseData,
    FeedbackRequest,
    LoginRequest,
    SignupRequest,
    AuthResponse,
    ProfileResponse,
    ProfileUpdateRequest,
    ChangePasswordRequest,
)
from .auth import create_access_token, get_current_user, hash_password, verify_password
from .pipeline.preprocess import load_image, save_preview
from .pipeline import run_pipeline


app = FastAPI(title="Dental AI Inference Service")
job_manager = JobManager()


@app.on_event("startup")
def on_startup() -> None:
    ensure_directories()
    storage.init_db()


@app.on_event("shutdown")
def on_shutdown() -> None:
    job_manager.shutdown()


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _profile_from_user(user: Dict[str, Any]) -> ProfileResponse:
    return ProfileResponse(
        id=user["id"],
        name=user.get("name") or "",
        email=user.get("email") or "",
        first_name=user.get("first_name"),
        last_name=user.get("last_name"),
        phone=user.get("phone"),
        license_number=user.get("license_number"),
        specialty=user.get("specialty"),
        display_name=user.get("display_name"),
    )


@app.post("/auth/signup", response_model=AuthResponse)
async def signup(payload: SignupRequest) -> AuthResponse:
    if len(payload.password) < settings.password_min_length:
        raise HTTPException(status_code=400, detail=f"Password must be at least {settings.password_min_length} characters.")
    existing = storage.get_user_by_email(payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered.")
    user_id = f"user-{uuid.uuid4().hex[:12]}"
    storage.create_user(
        user_id=user_id,
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role="doctor",
        role_access=["doctor", "patient"],
    )
    user = storage.get_user_by_id(user_id)
    token = create_access_token(user)
    return AuthResponse(access_token=token)


@app.post("/auth/login", response_model=AuthResponse)
async def login(payload: LoginRequest) -> AuthResponse:
    user = storage.get_user_by_email(payload.email)
    if not user or not verify_password(payload.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    storage.update_user_last_login(user["id"])
    token = create_access_token(user)
    return AuthResponse(access_token=token)


@app.get("/settings/profile", response_model=ProfileResponse)
async def get_profile(current_user: Dict[str, Any] = Depends(get_current_user)) -> ProfileResponse:
    return _profile_from_user(current_user)


@app.post("/settings/profile", response_model=ProfileResponse)
async def update_profile(
    payload: ProfileUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> ProfileResponse:
    updates = payload.model_dump(exclude_unset=True)
    email = updates.get("email")
    if email and email.lower() != current_user.get("email"):
        existing = storage.get_user_by_email(email)
        if existing and existing.get("id") != current_user.get("id"):
            raise HTTPException(status_code=400, detail="Email already in use.")
        updates["email"] = email.lower()
    if "name" in updates and updates["name"]:
        updates["display_name"] = updates.get("display_name") or updates["name"]
    user = storage.update_user_profile(current_user["id"], updates)
    return _profile_from_user(user)


@app.post("/settings/change-password")
async def change_password(
    payload: ChangePasswordRequest,
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> JSONResponse:
    if not verify_password(payload.current_password, current_user.get("password_hash", "")):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    if len(payload.new_password) < settings.password_min_length:
        raise HTTPException(status_code=400, detail=f"Password must be at least {settings.password_min_length} characters.")
    storage.update_user_password(current_user["id"], hash_password(payload.new_password))
    return JSONResponse(content={"status": "ok"})


@app.post("/analyze-xray", response_model=AnalyzeResponse)
async def analyze_xray(
    file: UploadFile = File(...),
    doctor_notes: Optional[str] = Form(None),
    patient_id: Optional[str] = Form(None),
    modality: Optional[str] = Form(None),
) -> AnalyzeResponse:
    case_id = f"case-{uuid.uuid4().hex[:8]}"
    job_id = f"job-{uuid.uuid4().hex[:8]}"

    suffix = Path(file.filename or "image").suffix or ".png"
    image_path = settings.data_dir / "images" / f"{case_id}{suffix}"
    preview_path = settings.data_dir / "previews" / f"{case_id}.png"

    with image_path.open("wb") as buffer:
        buffer.write(await file.read())

    image, meta = load_image(image_path)
    save_preview(image, preview_path)

    storage.create_case(
        case_id=case_id,
        patient_id=patient_id,
        image_path=str(image_path),
        preview_path=str(preview_path),
        image_width=meta["width"],
        image_height=meta["height"],
    )
    storage.create_job(job_id=job_id, case_id=case_id)

    if settings.async_processing:
        job_manager.submit(job_id=job_id, case_id=case_id, image_path=image_path)
    else:
        result, _ = run_pipeline(image_path=image_path, model_dir=settings.model_dir, device=settings.device)
        storage.update_case_result(case_id, result)
        storage.update_job(job_id, "complete", 100)

    return AnalyzeResponse(
        case_id=case_id,
        job_id=job_id,
        status="queued",
        progress=0,
        preview_url=f"/cases/{case_id}/preview",
        poll_url=f"/analysis/{job_id}",
    )


@app.get("/analysis/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str) -> JobStatus:
    job = storage.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    result_url = f"/cases/{job['case_id']}" if job["status"] == "complete" else None
    return JobStatus(
        job_id=job["job_id"],
        case_id=job["case_id"],
        status=job["status"],
        progress=job["progress"],
        error=job.get("error"),
        result_url=result_url,
    )


@app.get("/cases/{case_id}")
async def get_case(case_id: str) -> JSONResponse:
    case = storage.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    if not case["result"]:
        return JSONResponse(status_code=202, content={"status": case["status"], "case_id": case_id})

    result = case["result"]
    payload = {
        "case_id": case_id,
        "patient_id": case.get("patient_id"),
        "created_at": case["created_at"],
        "image_width": case["image_width"],
        "image_height": case["image_height"],
        "preview_url": f"/cases/{case_id}/preview",
        "findings": result.get("findings", []),
        "measurements": result.get("measurements", {}),
        "urgency": result.get("urgency", {}),
    }
    return JSONResponse(content=payload)


@app.get("/cases/{case_id}/preview")
async def get_preview(case_id: str) -> FileResponse:
    case = storage.get_case(case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    preview_path = case["preview_path"]
    if not preview_path or not Path(preview_path).exists():
        raise HTTPException(status_code=404, detail="Preview not available")
    return FileResponse(preview_path, media_type="image/png")


@app.post("/feedback")
async def submit_feedback(payload: FeedbackRequest) -> JSONResponse:
    case = storage.get_case(payload.case_id)
    if not case or not case["result"]:
        raise HTTPException(status_code=404, detail="Case not found")

    result = case["result"]
    findings = result.get("findings", [])
    findings_by_id = {f.get("id"): f for f in findings}

    for action in payload.actions:
        if action.action == "add_missing" and action.after:
            new_id = max([f.get("id", 0) for f in findings] + [0]) + 1
            new_finding = {"id": new_id, **action.after}
            findings.append(new_finding)
            continue

        if action.finding_id is None:
            continue
        finding = findings_by_id.get(action.finding_id)
        if not finding:
            continue

        if action.action == "accept":
            finding["status"] = "accepted"
        elif action.action == "reject":
            finding["status"] = "rejected"
        elif action.action == "set_routine":
            finding["severity"] = "routine"
            finding["status"] = "corrected"
        elif action.action == "correct":
            if action.after:
                finding.update(action.after)
            finding["status"] = "corrected"

    result["findings"] = findings
    storage.update_case_result(payload.case_id, result)
    storage.save_feedback(payload.case_id, payload.model_dump())
    return JSONResponse(content={"status": "ok"})


@app.get("/metrics")
async def get_metrics() -> JSONResponse:
    metrics = storage.build_metrics()
    return JSONResponse(content=metrics)
