from __future__ import annotations

from pathlib import Path
from typing import Dict, Tuple

import cv2
import numpy as np
import pydicom
from pydicom.pixel_data_handlers.util import apply_voi_lut


def _normalize_to_uint8(image: np.ndarray) -> np.ndarray:
    image = image.astype("float32")
    image -= image.min()
    if image.max() > 0:
        image = image / image.max()
    image = (image * 255).clip(0, 255).astype("uint8")
    return image


def _auto_orient(image: np.ndarray, ds: pydicom.Dataset | None = None) -> np.ndarray:
    if ds is None:
        return image
    orientation = ds.get("PatientOrientation")
    if isinstance(orientation, (list, tuple)) and orientation:
        # Basic left/right normalization when orientation tags are present.
        if orientation[0] == "R":
            image = cv2.flip(image, 1)
    return image


def load_image(path: Path) -> Tuple[np.ndarray, Dict[str, int]]:
    if path.suffix.lower() == ".dcm":
        ds = pydicom.dcmread(str(path))
        pixel = apply_voi_lut(ds.pixel_array, ds) if hasattr(ds, "pixel_array") else ds.pixel_array
        if ds.get("PhotometricInterpretation", "") == "MONOCHROME1":
            pixel = np.max(pixel) - pixel
        image = _normalize_to_uint8(pixel)
        image = _auto_orient(image, ds)
    else:
        image = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
        if image is None:
            raise ValueError("Unable to read image")
        image = _normalize_to_uint8(image)

    # CLAHE
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    image = clahe.apply(image)

    # Denoise
    image = cv2.fastNlMeansDenoising(image, h=10)

    meta = {"width": int(image.shape[1]), "height": int(image.shape[0])}
    return image, meta


def save_preview(image: np.ndarray, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    cv2.imwrite(str(path), image)
