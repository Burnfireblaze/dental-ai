from __future__ import annotations

import argparse
import json
import random
import shutil
import sqlite3
from pathlib import Path
from typing import Dict, List, Tuple


ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "ai_dental.db"
DEFAULT_LABELS = ROOT / "config" / "yolo_classes.json"


def _load_labels(path: Path) -> Tuple[List[str], Dict[str, str]]:
    payload = json.loads(path.read_text())
    classes = payload.get("classes", [])
    aliases = payload.get("aliases", {})
    return classes, {k.lower(): v for k, v in aliases.items()}


def _normalize_label(label: str, aliases: Dict[str, str]) -> str:
    if not label:
        return ""
    key = label.strip().lower()
    return aliases.get(key, label.strip())


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def _collect_cases() -> List[sqlite3.Row]:
    conn = _connect()
    try:
        rows = conn.execute(
            """
            SELECT case_id, image_path, preview_path, image_width, image_height, result_json
            FROM cases
            WHERE result_json IS NOT NULL
            """
        ).fetchall()
        return list(rows)
    finally:
        conn.close()


def _write_data_yaml(out_dir: Path, classes: List[str]) -> None:
    names = {idx: name for idx, name in enumerate(classes)}
    lines = [
        f"path: {out_dir.as_posix()}",
        "train: images/train",
        "val: images/val",
        "names:",
    ]
    for idx, name in names.items():
        lines.append(f"  {idx}: {name}")
    (out_dir / "data.yaml").write_text("\n".join(lines))


def _make_dirs(out_dir: Path) -> Dict[str, Path]:
    images_train = out_dir / "images" / "train"
    images_val = out_dir / "images" / "val"
    labels_train = out_dir / "labels" / "train"
    labels_val = out_dir / "labels" / "val"
    for path in [images_train, images_val, labels_train, labels_val]:
        path.mkdir(parents=True, exist_ok=True)
    return {
        "images_train": images_train,
        "images_val": images_val,
        "labels_train": labels_train,
        "labels_val": labels_val,
    }


def _split(case_id: str, val_ratio: float) -> str:
    bucket = sum(ord(ch) for ch in case_id) % 100
    return "val" if bucket < int(val_ratio * 100) else "train"


def export_dataset(out_dir: Path, label_map: Path, val_ratio: float = 0.2) -> None:
    out_dir = out_dir.expanduser().resolve()
    classes, aliases = _load_labels(label_map)
    if not classes:
        raise ValueError("Label map contains no classes.")
    class_index = {name: idx for idx, name in enumerate(classes)}

    out_dir.mkdir(parents=True, exist_ok=True)
    paths = _make_dirs(out_dir)

    rows = _collect_cases()
    summary = {
        "total_cases": 0,
        "exported_images": 0,
        "exported_labels": 0,
        "skipped_findings": 0,
        "val_images": 0,
        "train_images": 0,
        "val_seeded": False,
    }

    for row in rows:
        result_json = row["result_json"]
        if not result_json:
            continue
        result = json.loads(result_json)
        findings = result.get("findings", [])
        if not findings:
            continue

        width = row["image_width"]
        height = row["image_height"]
        if not width or not height:
            continue

        split = _split(row["case_id"], val_ratio)
        label_lines = []
        for finding in findings:
            if finding.get("status") not in {"accepted", "corrected"}:
                continue
            label = _normalize_label(finding.get("label", ""), aliases)
            if label not in class_index:
                summary["skipped_findings"] += 1
                continue
            bbox = finding.get("bbox")
            if not bbox or len(bbox) != 4:
                summary["skipped_findings"] += 1
                continue
            x1, y1, x2, y2 = bbox
            if width <= 0 or height <= 0:
                continue
            x_center = ((x1 + x2) / 2) / width
            y_center = ((y1 + y2) / 2) / height
            box_w = (x2 - x1) / width
            box_h = (y2 - y1) / height
            if box_w <= 0 or box_h <= 0:
                summary["skipped_findings"] += 1
                continue
            label_lines.append(f"{class_index[label]} {x_center:.6f} {y_center:.6f} {box_w:.6f} {box_h:.6f}")

        if not label_lines:
            continue

        source_image = row["preview_path"] or row["image_path"]
        if not source_image:
            continue
        source_image_path = Path(source_image)
        if not source_image_path.exists():
            continue

        target_image = paths[f"images_{split}"] / f"{row['case_id']}{source_image_path.suffix}"
        target_label = paths[f"labels_{split}"] / f"{row['case_id']}.txt"
        shutil.copy2(source_image_path, target_image)
        target_label.write_text("\n".join(label_lines))

        summary["exported_images"] += 1
        summary["exported_labels"] += len(label_lines)
        summary["total_cases"] += 1

    train_images = sorted(paths["images_train"].glob("*"))
    val_images = sorted(paths["images_val"].glob("*"))
    summary["train_images"] = len(train_images)
    summary["val_images"] = len(val_images)

    if not val_images and train_images:
        seed_image = train_images[0]
        seed_label = paths["labels_train"] / f"{seed_image.stem}.txt"
        target_image = paths["images_val"] / seed_image.name
        target_label = paths["labels_val"] / seed_label.name
        shutil.copy2(seed_image, target_image)
        if seed_label.exists():
            shutil.copy2(seed_label, target_label)
        summary["val_images"] = 1
        summary["val_seeded"] = True

    _write_data_yaml(out_dir, classes)
    (out_dir / "summary.json").write_text(json.dumps(summary, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="Export accepted/corrected findings into a YOLO dataset.")
    parser.add_argument("--out", default=str(DATA_DIR / "yolo_export"), help="Output dataset directory")
    parser.add_argument("--labels", default=str(DEFAULT_LABELS), help="Label map JSON")
    parser.add_argument("--val-ratio", type=float, default=0.2, help="Validation split ratio")
    args = parser.parse_args()

    export_dataset(Path(args.out), Path(args.labels), args.val_ratio)
    print(f"Dataset exported to {args.out}")


if __name__ == "__main__":
    main()
