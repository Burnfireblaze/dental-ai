from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import List, Dict, Any, Optional

import numpy as np


@dataclass
class Detection:
    label: str
    confidence: float
    bbox: List[float]


class DetectionModel:
    def __init__(self, model_path: Path, device: str = "cpu") -> None:
        self.model_path = model_path
        self.device = device
        self._loaded = False
        self._model = None

    def load(self) -> None:
        if self._loaded:
            return
        try:
            from ultralytics import YOLO
        except Exception:
            self._loaded = False
            return
        if not self.model_path.exists():
            self._loaded = False
            return
        self._model = YOLO(str(self.model_path))
        self._loaded = True

    def predict(self, image: np.ndarray) -> List[Detection]:
        if not self._loaded or self._model is None:
            return []

        results = self._model.predict(image, verbose=False, device=0 if self.device != "cpu" else "cpu")
        detections: List[Detection] = []
        for result in results:
            for box in result.boxes:
                conf = float(box.conf[0]) if hasattr(box.conf, "__len__") else float(box.conf)
                cls_id = int(box.cls[0]) if hasattr(box.cls, "__len__") else int(box.cls)
                label = result.names.get(cls_id, f"class_{cls_id}")
                x1, y1, x2, y2 = [float(x) for x in box.xyxy[0].tolist()]
                detections.append(Detection(label=label, confidence=conf, bbox=[x1, y1, x2, y2]))
        return detections


def run_detection(image: np.ndarray, model_path: Optional[Path], device: str) -> List[Detection]:
    if model_path is None:
        return []
    model = DetectionModel(model_path=model_path, device=device)
    model.load()
    return model.predict(image)
