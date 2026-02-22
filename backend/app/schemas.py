from __future__ import annotations

from datetime import datetime
from typing import List, Optional, Dict, Any, Literal

from pydantic import BaseModel, Field


Severity = Literal["urgent", "attention", "routine"]
FindingStatus = Literal["pending", "accepted", "rejected", "corrected"]
JobState = Literal["queued", "processing", "complete", "failed"]
FeedbackActionType = Literal["accept", "reject", "correct", "set_routine", "add_missing"]


class Finding(BaseModel):
    id: int
    tooth: int
    label: str
    severity: Severity
    confidence: float = Field(..., ge=0.0, le=1.0)
    bbox: List[float]
    polygon: List[List[float]] = []
    explanation_doctor: Optional[str] = None
    explanation_patient: Optional[str] = None
    timeline: Optional[str] = None
    action: Optional[str] = None
    modality: Optional[str] = None
    status: FindingStatus = "pending"


class Measurements(BaseModel):
    bone_loss_percent: float = 0.0
    by_tooth: Dict[str, float] = {}


class Urgency(BaseModel):
    level: Severity
    score: float
    timeline: str
    action: str
    summary: str
    priority_findings: List[str]
    recommendation: str


class CaseData(BaseModel):
    case_id: str
    patient_id: Optional[str] = None
    created_at: datetime
    image_width: int
    image_height: int
    preview_url: str
    findings: List[Finding]
    measurements: Measurements
    urgency: Urgency


class AnalyzeResponse(BaseModel):
    case_id: str
    job_id: str
    status: JobState
    progress: int
    preview_url: str
    poll_url: str


class JobStatus(BaseModel):
    job_id: str
    case_id: str
    status: JobState
    progress: int
    error: Optional[str] = None
    result_url: Optional[str] = None


class FeedbackAction(BaseModel):
    finding_id: Optional[int] = None
    action: FeedbackActionType
    before: Optional[Dict[str, Any]] = None
    after: Optional[Dict[str, Any]] = None
    notes: Optional[str] = None


class FeedbackRequest(BaseModel):
    case_id: str
    doctor_id: Optional[str] = None
    actions: List[FeedbackAction]



class AssistantMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class AssistantChatRequest(BaseModel):
    message: str
    case_id: Optional[str] = None
    doctor_name: Optional[str] = None
    history: List[AssistantMessage] = []


class AssistantChatResponse(BaseModel):
    response: str
    tools_used: List[str] = []
class MetricCalibrationItem(BaseModel):
    category: str
    accepted: int
    corrected: int
    rejected: int
    accuracy: float


class MetricUrgencyItem(BaseModel):
    level: str
    count: int
    percentage: float


class MetricCorrectionItem(BaseModel):
    id: int
    condition: str
    original_tooth: Optional[str] = None
    corrected_tooth: Optional[str] = None
    change: Optional[str] = None
    date: str


class Metrics(BaseModel):
    sessions_analyzed: int
    acceptance_rate: float
    corrections_made: int
    average_urgency: float
    calibration: List[MetricCalibrationItem]
    urgency_distribution: List[MetricUrgencyItem]
    recent_corrections: List[MetricCorrectionItem]
