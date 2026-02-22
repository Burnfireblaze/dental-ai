from __future__ import annotations

import math
from typing import List, Dict, Any

from .explanations import generate_explanations
from .urgency import timeline_for, action_for


URGENT_KEYWORDS = ("periapical", "abscess", "root canal", "fracture", "failed restoration")
ATTENTION_KEYWORDS = ("caries", "bone loss", "implant", "resorption", "furcation")


def _title_case(label: str) -> str:
    return label.replace("_", " ").replace("-", " ").title()


def calibrate_confidence(confidence: float, temperature: float = 1.2) -> float:
    confidence = max(1e-4, min(1 - 1e-4, confidence))
    logit = math.log(confidence / (1 - confidence))
    scaled = 1 / (1 + math.exp(-logit / temperature))
    return float(scaled)


def assign_tooth_numbers(detections: List[Dict[str, Any]], image_height: int) -> None:
    upper = []
    lower = []
    for det in detections:
        x1, y1, x2, y2 = det["bbox"]
        center_y = (y1 + y2) / 2
        if center_y <= image_height / 2:
            upper.append(det)
        else:
            lower.append(det)

    upper = sorted(upper, key=lambda d: (d["bbox"][0] + d["bbox"][2]) / 2)
    lower = sorted(lower, key=lambda d: (d["bbox"][0] + d["bbox"][2]) / 2)

    upper_numbers = list(range(1, 17))
    lower_numbers = list(range(17, 33))

    for det, tooth in zip(upper, upper_numbers):
        det["tooth"] = tooth
    for det, tooth in zip(lower, lower_numbers):
        det["tooth"] = tooth



def severity_for(label: str, confidence: float) -> str:
    label_lower = label.lower()
    if any(keyword in label_lower for keyword in URGENT_KEYWORDS) or confidence >= 0.9:
        return "urgent"
    if any(keyword in label_lower for keyword in ATTENTION_KEYWORDS) or confidence >= 0.75:
        return "attention"
    return "routine"


def build_findings(raw_detections: List[Dict[str, Any]], image_height: int) -> List[Dict[str, Any]]:
    detections = []
    for det in raw_detections:
        label = _title_case(det["label"])
        conf = calibrate_confidence(det["confidence"])
        bbox = det["bbox"]
        detections.append({"label": label, "confidence": conf, "bbox": bbox})

    assign_tooth_numbers(detections, image_height)

    findings = []
    for idx, det in enumerate(detections, start=1):
        severity = severity_for(det["label"], det["confidence"])
        explanation_doctor, explanation_patient = generate_explanations(det["label"])
        bbox = det["bbox"]
        polygon = [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[1]],
            [bbox[2], bbox[3]],
            [bbox[0], bbox[3]],
        ]
        findings.append(
            {
                "id": idx,
                "tooth": det.get("tooth", 0),
                "label": det["label"],
                "severity": severity,
                "confidence": det["confidence"],
                "bbox": bbox,
                "polygon": polygon,
                "explanation_doctor": explanation_doctor,
                "explanation_patient": explanation_patient,
                "timeline": timeline_for(severity),
                "action": action_for(severity),
                "status": "pending",
            }
        )

    return findings
