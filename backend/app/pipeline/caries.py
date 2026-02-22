from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import List, Tuple

import numpy as np


@dataclass
class CariesResult:
    label: str
    confidence: float


class CariesClassifier:
    def __init__(self, model_path: Path, device: str = "cpu") -> None:
        self.model_path = model_path
        self.device = device
        self._loaded = False
        self._model = None

    def load(self) -> None:
        if self._loaded:
            return
        try:
            import timm
            import torch
        except Exception:
            self._loaded = False
            return
        if not self.model_path.exists():
            self._loaded = False
            return
        try:
            self._model = timm.create_model("efficientnet_b0", pretrained=False, num_classes=3)
            state = torch.load(self.model_path, map_location=self.device)
            self._model.load_state_dict(state)
            self._model.eval()
            self._loaded = True
        except Exception:
            self._loaded = False

    def predict(self, crops: List[np.ndarray]) -> List[CariesResult]:
        if not self._loaded or self._model is None:
            return []
        # Placeholder for real inference. Keeps API stable.
        return [CariesResult(label="Caries", confidence=0.7) for _ in crops]


def classify_caries(crops: List[np.ndarray], model_path: Path, device: str) -> List[CariesResult]:
    model = CariesClassifier(model_path=model_path, device=device)
    model.load()
    return model.predict(crops)
