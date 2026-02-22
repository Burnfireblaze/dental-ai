from __future__ import annotations

import argparse
from pathlib import Path

from ultralytics import YOLO

try:
    import torch
except Exception:  # pragma: no cover
    torch = None

try:
    import yaml
except Exception:  # pragma: no cover
    yaml = None

try:
    import numpy as np
    if not hasattr(np, "trapz") and hasattr(np, "trapezoid"):
        np.trapz = np.trapezoid  # type: ignore[attr-defined]
except Exception:  # pragma: no cover
    np = None


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MODEL = ROOT / "models" / "dental_xray_ai_yolo_v8.pt"
DEFAULT_DATA = ROOT / "data" / "yolo_export" / "data.yaml"
DEFAULT_OUT = ROOT / "data" / "training_runs"


def main() -> None:
    parser = argparse.ArgumentParser(description="Fine-tune YOLOv8 model on exported feedback dataset.")
    parser.add_argument("--model", default=str(DEFAULT_MODEL), help="Path to base model weights")
    parser.add_argument("--data", default=str(DEFAULT_DATA), help="Path to YOLO data.yaml")
    parser.add_argument("--epochs", type=int, default=50)
    parser.add_argument("--imgsz", type=int, default=1024)
    parser.add_argument("--batch", type=int, default=8)
    parser.add_argument("--device", default="auto")
    parser.add_argument("--project", default=str(DEFAULT_OUT))
    parser.add_argument("--name", default="retrain")
    args = parser.parse_args()

    model_path = Path(args.model)
    data_path = Path(args.data)
    if not model_path.exists():
        raise FileNotFoundError(f"Model not found: {model_path}")
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset config not found: {data_path}")

    resolved_data_path = data_path
    data_root = None
    if yaml is not None:
        payload = yaml.safe_load(data_path.read_text()) or {}
        data_root_value = payload.get("path")
        if data_root_value:
            root_path = Path(data_root_value)
            if not root_path.is_absolute():
                root_path = (data_path.parent / root_path).resolve()
                payload["path"] = root_path.as_posix()
                resolved_data_path = data_path.parent / "data.resolved.yaml"
                resolved_data_path.write_text(yaml.safe_dump(payload, sort_keys=False))
            data_root = root_path

    if data_root:
        train_dir = data_root / "images" / "train"
        val_dir = data_root / "images" / "val"
        if not train_dir.exists() or not val_dir.exists():
            raise FileNotFoundError(
                f"Dataset export missing images. Expected {train_dir} and {val_dir}. "
                "Run export_cases_yolo.py first."
            )

    device = args.device
    if device == "auto":
        if torch is not None and torch.cuda.is_available():
            device = "0"
        else:
            device = "cpu"
    else:
        if device != "cpu" and (torch is None or not torch.cuda.is_available()):
            print("CUDA not available. Falling back to CPU.")
            device = "cpu"

    model = YOLO(str(model_path))
    model.train(
        data=str(resolved_data_path),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        device=device,
        project=args.project,
        name=args.name,
        exist_ok=True,
    )


if __name__ == "__main__":
    main()
