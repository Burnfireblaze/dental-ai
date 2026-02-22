from __future__ import annotations

from pathlib import Path
from typing import Dict, Any, Tuple

import cv2
import numpy as np

from .preprocess import load_image
from .segmentation import run_segmentation
from .detection import run_detection
from .measurements import compute_bone_loss
from .postprocess import build_findings
from .urgency import summarize_urgency
from ..settings import settings


def run_pipeline(image_path: Path, model_dir: Path, device: str) -> Tuple[Dict[str, Any], Dict[str, int]]:
    image, meta = load_image(image_path)

    segmentation_path = settings.segmentation_model_path or (model_dir / "tooth_bone_segmentation")
    primary_detection_path = settings.detection_primary_model_path or (model_dir / "best.pt")
    secondary_detection_path = settings.detection_secondary_model_path

    detection_input = image
    if detection_input.ndim == 2:
        detection_input = cv2.cvtColor(detection_input, cv2.COLOR_GRAY2BGR)
    elif detection_input.ndim == 3 and detection_input.shape[2] == 1:
        detection_input = np.repeat(detection_input, 3, axis=2)

    primary_detections = run_detection(detection_input, primary_detection_path, device)
    secondary_detections = run_detection(detection_input, secondary_detection_path, device) if secondary_detection_path else []
    segmentation = run_segmentation(image, segmentation_path, device)

    raw_detections = [
        {"label": det.label, "confidence": det.confidence, "bbox": det.bbox}
        for det in primary_detections
    ]
    secondary_raw = [
        {"label": det.label, "confidence": det.confidence, "bbox": det.bbox}
        for det in secondary_detections
    ]
    raw_detections.extend(_merge_secondary(raw_detections, secondary_raw))

    findings = build_findings(raw_detections, meta["height"])

    bone_loss_percent, by_tooth = compute_bone_loss(segmentation.tooth_mask, segmentation.bone_mask)
    urgency = summarize_urgency(findings)

    result = {
        "findings": findings,
        "measurements": {
            "bone_loss_percent": bone_loss_percent,
            "by_tooth": by_tooth,
        },
        "urgency": urgency,
    }

    return result, meta


def _iou(box_a: list[float], box_b: list[float]) -> float:
    ax1, ay1, ax2, ay2 = box_a
    bx1, by1, bx2, by2 = box_b
    inter_x1 = max(ax1, bx1)
    inter_y1 = max(ay1, by1)
    inter_x2 = min(ax2, bx2)
    inter_y2 = min(ay2, by2)
    inter_w = max(0.0, inter_x2 - inter_x1)
    inter_h = max(0.0, inter_y2 - inter_y1)
    inter_area = inter_w * inter_h
    area_a = max(0.0, ax2 - ax1) * max(0.0, ay2 - ay1)
    area_b = max(0.0, bx2 - bx1) * max(0.0, by2 - by1)
    union = area_a + area_b - inter_area
    if union <= 0:
        return 0.0
    return inter_area / union


def _merge_secondary(primary: list[dict[str, Any]], secondary: list[dict[str, Any]]) -> list[dict[str, Any]]:
    merged: list[dict[str, Any]] = []
    for det in secondary:
        matched = False
        for primary_det in primary:
            if primary_det["label"].lower() != det["label"].lower():
                continue
            if _iou(primary_det["bbox"], det["bbox"]) >= 0.5:
                matched = True
                if det["confidence"] > primary_det["confidence"]:
                    primary_det["confidence"] = det["confidence"]
                break
        if not matched:
            merged.append(det)
    return merged
