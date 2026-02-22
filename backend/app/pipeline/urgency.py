from __future__ import annotations

from typing import List, Dict, Tuple

SEVERITY_SCORE = {"urgent": 9.0, "attention": 6.0, "routine": 3.0}


def timeline_for(severity: str) -> str:
    if severity == "urgent":
        return "Within 24-48 hours"
    if severity == "attention":
        return "Within 1-2 weeks"
    return "Next routine visit"


def action_for(severity: str) -> str:
    if severity == "urgent":
        return "Schedule immediate appointment"
    if severity == "attention":
        return "Plan treatment during upcoming visit"
    return "Monitor and re-evaluate"


def summarize_urgency(findings: List[Dict[str, str]]) -> Dict[str, any]:
    if not findings:
        return {
            "level": "routine",
            "score": 0.0,
            "timeline": "Next routine visit",
            "action": "No urgent action required",
            "summary": "No significant findings detected.",
            "priority_findings": [],
            "recommendation": "Continue routine monitoring",
        }

    level = "routine"
    if any(f["severity"] == "urgent" for f in findings):
        level = "urgent"
    elif any(f["severity"] == "attention" for f in findings):
        level = "attention"

    score = round(sum(SEVERITY_SCORE[f["severity"]] for f in findings) / len(findings), 1)
    priority_findings = [f"{f['label']} on tooth #{f['tooth']}" for f in findings if f["severity"] == level][:3]
    summary = (
        "Multiple urgent findings detected requiring prompt attention"
        if level == "urgent"
        else "Findings require attention but are not emergent"
        if level == "attention"
        else "Findings are stable and can be monitored"
    )

    return {
        "level": level,
        "score": score,
        "timeline": timeline_for(level),
        "action": action_for(level),
        "summary": summary,
        "priority_findings": priority_findings,
        "recommendation": "Contact patient immediately" if level == "urgent" else "Schedule during next available appointment" if level == "attention" else "Continue routine care",
    }
