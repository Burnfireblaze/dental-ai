from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

from .settings import settings


DB_PATH = settings.data_dir / "ai_dental.db"


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    conn = _connect()
    try:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS cases (
                case_id TEXT PRIMARY KEY,
                patient_id TEXT,
                created_at TEXT,
                image_path TEXT,
                preview_path TEXT,
                image_width INTEGER,
                image_height INTEGER,
                result_json TEXT,
                status TEXT
            );

            CREATE TABLE IF NOT EXISTS jobs (
                job_id TEXT PRIMARY KEY,
                case_id TEXT,
                status TEXT,
                progress INTEGER,
                error TEXT,
                created_at TEXT,
                updated_at TEXT
            );

            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                case_id TEXT,
                created_at TEXT,
                payload TEXT
            );
            """
        )
        conn.commit()
    finally:
        conn.close()


def create_case(
    case_id: str,
    patient_id: Optional[str],
    image_path: str,
    preview_path: str,
    image_width: int,
    image_height: int,
) -> None:
    conn = _connect()
    try:
        conn.execute(
            """
            INSERT INTO cases (case_id, patient_id, created_at, image_path, preview_path, image_width, image_height, result_json, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                case_id,
                patient_id,
                datetime.utcnow().isoformat(),
                image_path,
                preview_path,
                image_width,
                image_height,
                None,
                "processing",
            ),
        )
        conn.commit()
    finally:
        conn.close()


def update_case_result(case_id: str, result: Dict[str, Any]) -> None:
    conn = _connect()
    try:
        conn.execute(
            "UPDATE cases SET result_json = ?, status = ? WHERE case_id = ?",
            (json.dumps(result), "complete", case_id),
        )
        conn.commit()
    finally:
        conn.close()


def update_case_status(case_id: str, status: str) -> None:
    conn = _connect()
    try:
        conn.execute("UPDATE cases SET status = ? WHERE case_id = ?", (status, case_id))
        conn.commit()
    finally:
        conn.close()


def get_case(case_id: str) -> Optional[Dict[str, Any]]:
    conn = _connect()
    try:
        row = conn.execute("SELECT * FROM cases WHERE case_id = ?", (case_id,)).fetchone()
        if not row:
            return None
        result_json = row["result_json"]
        result = json.loads(result_json) if result_json else None
        return {
            "case_id": row["case_id"],
            "patient_id": row["patient_id"],
            "created_at": row["created_at"],
            "image_path": row["image_path"],
            "preview_path": row["preview_path"],
            "image_width": row["image_width"],
            "image_height": row["image_height"],
            "result": result,
            "status": row["status"],
        }
    finally:
        conn.close()


def create_job(job_id: str, case_id: str) -> None:
    conn = _connect()
    try:
        now = datetime.utcnow().isoformat()
        conn.execute(
            """
            INSERT INTO jobs (job_id, case_id, status, progress, error, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (job_id, case_id, "queued", 0, None, now, now),
        )
        conn.commit()
    finally:
        conn.close()


def update_job(job_id: str, status: str, progress: int, error: Optional[str] = None) -> None:
    conn = _connect()
    try:
        conn.execute(
            "UPDATE jobs SET status = ?, progress = ?, error = ?, updated_at = ? WHERE job_id = ?",
            (status, progress, error, datetime.utcnow().isoformat(), job_id),
        )
        conn.commit()
    finally:
        conn.close()


def get_job(job_id: str) -> Optional[Dict[str, Any]]:
    conn = _connect()
    try:
        row = conn.execute("SELECT * FROM jobs WHERE job_id = ?", (job_id,)).fetchone()
        if not row:
            return None
        return {
            "job_id": row["job_id"],
            "case_id": row["case_id"],
            "status": row["status"],
            "progress": row["progress"],
            "error": row["error"],
        }
    finally:
        conn.close()


def save_feedback(case_id: str, payload: Dict[str, Any]) -> None:
    conn = _connect()
    try:
        conn.execute(
            "INSERT INTO feedback (case_id, created_at, payload) VALUES (?, ?, ?)",
            (case_id, datetime.utcnow().isoformat(), json.dumps(payload)),
        )
        conn.commit()
    finally:
        conn.close()

    feedback_dir = settings.data_dir / "active_learning"
    feedback_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.utcnow().strftime("%Y%m%dT%H%M%S")
    out_path = feedback_dir / f"feedback_{case_id}_{stamp}.json"
    out_path.write_text(json.dumps(payload, indent=2))


def list_feedback() -> List[Dict[str, Any]]:
    conn = _connect()
    try:
        rows = conn.execute("SELECT * FROM feedback ORDER BY id DESC LIMIT 25").fetchall()
        results = []
        for row in rows:
            payload = json.loads(row["payload"]) if row["payload"] else {}
            results.append(
                {
                    "id": row["id"],
                    "case_id": row["case_id"],
                    "created_at": row["created_at"],
                    "payload": payload,
                }
            )
        return results
    finally:
        conn.close()


def _collect_findings() -> List[Dict[str, Any]]:
    conn = _connect()
    try:
        rows = conn.execute("SELECT result_json FROM cases WHERE result_json IS NOT NULL").fetchall()
        findings: List[Dict[str, Any]] = []
        for row in rows:
            result = json.loads(row["result_json"])
            findings.extend(result.get("findings", []))
        return findings
    finally:
        conn.close()


def build_metrics() -> Dict[str, Any]:
    conn = _connect()
    try:
        case_rows = conn.execute("SELECT result_json FROM cases WHERE result_json IS NOT NULL").fetchall()
        total_cases = len(case_rows)
        urgency_scores = []
        findings: List[Dict[str, Any]] = []
        for row in case_rows:
            result = json.loads(row["result_json"])
            urgency_scores.append(result.get("urgency", {}).get("score", 0))
            findings.extend(result.get("findings", []))
    finally:
        conn.close()

    total_findings = len(findings) if findings else 1
    accepted = len([f for f in findings if f.get("status") == "accepted"])
    corrected = len([f for f in findings if f.get("status") == "corrected"])
    rejected = len([f for f in findings if f.get("status") == "rejected"])

    acceptance_rate = round((accepted / total_findings) * 100, 1)
    average_urgency = round(sum(urgency_scores) / max(len(urgency_scores), 1), 1)

    # Calibration by category
    category_stats: Dict[str, Dict[str, int]] = {}
    for finding in findings:
        category = finding.get("label", "Other")
        category_stats.setdefault(category, {"accepted": 0, "corrected": 0, "rejected": 0})
        status = finding.get("status")
        if status in category_stats[category]:
            category_stats[category][status] += 1

    calibration = []
    for category, stats in category_stats.items():
        denom = stats["accepted"] + stats["corrected"] + stats["rejected"] or 1
        accuracy = round((stats["accepted"] / denom) * 100)
        calibration.append(
            {
                "category": category,
                "accepted": stats["accepted"],
                "corrected": stats["corrected"],
                "rejected": stats["rejected"],
                "accuracy": accuracy,
            }
        )
    calibration = sorted(calibration, key=lambda item: item["accepted"], reverse=True)[:5]

    # Urgency distribution
    urgency_counts: Dict[str, int] = {"Urgent": 0, "Attention": 0, "Routine": 0}
    for finding in findings:
        level = finding.get("severity", "routine")
        if level == "urgent":
            urgency_counts["Urgent"] += 1
        elif level == "attention":
            urgency_counts["Attention"] += 1
        else:
            urgency_counts["Routine"] += 1

    total_urg = sum(urgency_counts.values()) or 1
    urgency_distribution = [
        {
            "level": label,
            "count": count,
            "percentage": round((count / total_urg) * 100),
        }
        for label, count in urgency_counts.items()
    ]

    recent_feedback = list_feedback()
    recent_corrections = []
    for item in recent_feedback[:3]:
        payload = item["payload"]
        actions = payload.get("actions", [])
        if not actions:
            continue
        action = actions[0]
        change = action.get("notes") or action.get("action", "Correction")
        before = action.get("before", {})
        after = action.get("after", {})
        recent_corrections.append(
            {
                "id": item["id"],
                "condition": before.get("label") or after.get("label") or "Finding",
                "original_tooth": before.get("tooth"),
                "corrected_tooth": after.get("tooth"),
                "change": change,
                "date": item["created_at"][:10],
            }
        )

    return {
        "sessions_analyzed": total_cases,
        "acceptance_rate": acceptance_rate,
        "corrections_made": corrected,
        "average_urgency": average_urgency,
        "calibration": calibration,
        "urgency_distribution": urgency_distribution,
        "recent_corrections": recent_corrections,
    }
