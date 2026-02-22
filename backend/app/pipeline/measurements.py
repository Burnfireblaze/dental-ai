from __future__ import annotations

from typing import Dict, Tuple

import numpy as np


def compute_bone_loss(tooth_mask: np.ndarray | None, bone_mask: np.ndarray | None) -> Tuple[float, Dict[str, float]]:
    if tooth_mask is None or bone_mask is None:
        return 0.0, {}

    tooth_area = float((tooth_mask > 0).sum())
    bone_area = float((bone_mask > 0).sum())
    if tooth_area == 0:
        return 0.0, {}

    loss = max(0.0, min(100.0, 100.0 - (bone_area / tooth_area) * 100.0))
    return round(loss, 1), {}
