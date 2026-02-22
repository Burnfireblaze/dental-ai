from __future__ import annotations

import os
from typing import Any, Dict, List, Optional
import json
try:
    import httpx
except Exception:  # pragma: no cover
    httpx = None

from . import storage


SYSTEM_PROMPT = (
    "You are a data-driven dental clinical decision support assistant. "
    "You must ground every answer in the structured case data provided. "
    "If data is missing, say so explicitly and ask for clarification. "
    "Always reference tooth numbers and urgency/timeline fields when present. "
    "Prefer bullet points and concise clinical phrasing. "
    "Never provide a final diagnosis; provide supportive guidance only."
)


def _build_global_context(limit: int = 12) -> str:
    cases = storage.list_cases(limit=limit)
    if not cases:
        return "No prior cases in the database."

    completed_cases = [case for case in cases if case.get("result")]
    total_findings = 0
    urgent_findings = 0
    label_counts: Dict[str, int] = {}
    for case in completed_cases:
        findings = case["result"].get("findings", [])
        total_findings += len(findings)
        for finding in findings:
            if finding.get("severity") == "urgent":
                urgent_findings += 1
            label = finding.get("label") or "Other"
            label_counts[label] = label_counts.get(label, 0) + 1

    top_labels = sorted(label_counts.items(), key=lambda item: item[1], reverse=True)[:5]
    recent_cases = []
    for case in completed_cases[:5]:
        result = case["result"]
        urgency = result.get("urgency", {})
        findings = result.get("findings", [])[:5]
        recent_cases.append(
            {
                "case_id": case.get("case_id"),
                "patient_id": case.get("patient_id"),
                "created_at": case.get("created_at"),
                "urgency": urgency,
                "findings": [
                    {
                        "tooth": f.get("tooth"),
                        "label": f.get("label"),
                        "severity": f.get("severity"),
                        "confidence": f.get("confidence"),
                    }
                    for f in findings
                ],
            }
        )

    summary = {
        "total_cases": len(cases),
        "completed_cases": len(completed_cases),
        "total_findings": total_findings,
        "urgent_findings": urgent_findings,
        "top_labels": [{"label": label, "count": count} for label, count in top_labels],
        "recent_cases": recent_cases,
    }

    return "GLOBAL_CASE_DATA (JSON):\n" + json.dumps(summary, indent=2)


def _build_case_context(case: Optional[Dict[str, Any]]) -> str:
    if not case or not case.get("result"):
        return "No case data available. Provide general guidance."

    result = case["result"]
    findings = result.get("findings", [])
    urgency = result.get("urgency", {})
    measurements = result.get("measurements", {})

    summary = {
        "case_id": case.get("case_id"),
        "urgency": urgency,
        "measurements": measurements,
        "findings": [
            {
                "id": f.get("id"),
                "tooth": f.get("tooth"),
                "label": f.get("label"),
                "severity": f.get("severity"),
                "confidence": f.get("confidence"),
                "timeline": f.get("timeline"),
                "action": f.get("action"),
            }
            for f in findings
        ],
    }

    lines = [
        "STRUCTURED_CASE_DATA (JSON):",
        json.dumps(summary, indent=2),
    ]
    if findings:
        lines.append("Findings:")
        for f in findings:
            lines.append(
                f"- Tooth {f.get('tooth')}: {f.get('label')} "
                f"({f.get('severity')}, {int(float(f.get('confidence', 0)) * 100)}% conf). "
                f"Timeline: {f.get('timeline')}. Action: {f.get('action')}"
            )
    else:
        lines.append("Findings: none detected.")

    if measurements:
        bone_loss = measurements.get("bone_loss_percent")
        if bone_loss is not None:
            lines.append(f"Bone loss percent: {bone_loss:.2f}%")

    return "\n".join(lines)


def _build_messages(
    message: str,
    global_context: str,
    case_context: str,
    history: Optional[List[Dict[str, str]]] = None,
) -> List[Dict[str, str]]:
    messages: List[Dict[str, str]] = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"GLOBAL CONTEXT:\n{global_context}"},
        {"role": "system", "content": f"CASE CONTEXT:\n{case_context}"},
    ]
    if history:
        for item in history[-8:]:
            role = item.get("role", "user")
            content = item.get("content", "")
            if content:
                messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})
    return messages


def _groq_chat(messages: List[Dict[str, str]]) -> str:
    if not httpx:
        return "Assistant unavailable (httpx not installed)."
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key or "your_groq_key_here" in api_key:
        return "Assistant unavailable (missing GROQ_API_KEY)."
    model = os.environ.get("GROQ_MODEL", "llama3-70b-8192")
    base_url = os.environ.get("GROQ_BASE_URL", "https://api.groq.com/openai/v1/chat/completions")

    payload = {
        "model": model,
        "messages": messages,
        "temperature": 0.2,
        "max_tokens": 600,
    }
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        resp = httpx.post(base_url, json=payload, headers=headers, timeout=40)
        resp.raise_for_status()
        data = resp.json()
        return data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
    except Exception:
        return "Assistant error while contacting Groq API."


def chat(message: str, case_id: Optional[str], history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
    case = storage.get_case(case_id) if case_id else None
    global_context = _build_global_context()
    case_context = _build_case_context(case)
    messages = _build_messages(message, global_context, case_context, history)
    response = _groq_chat(messages)
    return {"response": response, "tools_used": []}
