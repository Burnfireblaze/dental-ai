from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional


BASE_DIR = Path(__file__).resolve().parent.parent

try:
    from dotenv import load_dotenv

    load_dotenv(BASE_DIR.parent / ".env")
    load_dotenv(BASE_DIR / ".env")
except Exception:
    pass


def _env(name: str, default: str) -> str:
    return os.environ.get(name, default)


def _env_bool(name: str, default: bool) -> bool:
    value = os.environ.get(name)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    data_dir: Path
    model_dir: Path
    device: str
    async_processing: bool
    cors_origins: List[str]
    segmentation_model_path: Optional[Path]
    detection_primary_model_path: Optional[Path]
    detection_secondary_model_path: Optional[Path]
    jwt_secret: str
    jwt_algorithm: str
    access_token_minutes: int
    password_min_length: int
    password_max_bytes: int


def _find_model(model_dir: Path, patterns: List[str]) -> Optional[Path]:
    if not model_dir.exists():
        return None
    best_score = -1
    best_path: Optional[Path] = None
    for path in model_dir.iterdir():
        if not path.is_file():
            continue
        name = path.name.lower()
        score = sum(1 for pattern in patterns if pattern in name)
        if score > best_score:
            best_score = score
            best_path = path
    return best_path


def _resolve_path(env_key: str, default_patterns: List[str], model_dir: Path) -> Optional[Path]:
    env_value = os.environ.get(env_key)
    if env_value:
        return Path(env_value)
    return _find_model(model_dir, default_patterns)


settings = Settings(
    data_dir=Path(_env("DATA_DIR", str(BASE_DIR / "data"))),
    model_dir=Path(_env("MODEL_DIR", str(BASE_DIR / "models"))),
    device=_env("DEVICE", "cuda" if os.environ.get("CUDA_VISIBLE_DEVICES") else "cpu"),
    async_processing=_env_bool("ASYNC_PROCESSING", True),
    cors_origins=[origin.strip() for origin in _env("CORS_ORIGINS", "http://localhost:5173").split(",") if origin.strip()],
    segmentation_model_path=None,
    detection_primary_model_path=None,
    detection_secondary_model_path=None,
    jwt_secret=_env("JWT_SECRET", "dev-secret-change-me"),
    jwt_algorithm=_env("JWT_ALGORITHM", "HS256"),
    access_token_minutes=int(_env("ACCESS_TOKEN_MINUTES", "1440")),
    password_min_length=int(_env("PASSWORD_MIN_LENGTH", "12")),
    password_max_bytes=int(_env("PASSWORD_MAX_BYTES", "72")),
)

settings = settings.__class__(  # type: ignore[misc]
    **{
        **settings.__dict__,
        "segmentation_model_path": _resolve_path(
            "SEGMENTATION_MODEL_PATH",
            ["segment", "seg", "nnunet", "nnu"],
            settings.model_dir,
        ),
        "detection_primary_model_path": _resolve_path(
            "DETECTION_PRIMARY_MODEL_PATH",
            ["best", "yolo", "detect", "v8"],
            settings.model_dir,
        ),
        "detection_secondary_model_path": _resolve_path(
            "DETECTION_SECONDARY_MODEL_PATH",
            ["disease", "diagnostic", "secondary"],
            settings.model_dir,
        ),
    }
)


def ensure_directories() -> None:
    settings.data_dir.mkdir(parents=True, exist_ok=True)
    (settings.data_dir / "images").mkdir(parents=True, exist_ok=True)
    (settings.data_dir / "previews").mkdir(parents=True, exist_ok=True)
    (settings.data_dir / "results").mkdir(parents=True, exist_ok=True)
    (settings.data_dir / "feedback").mkdir(parents=True, exist_ok=True)
    settings.model_dir.mkdir(parents=True, exist_ok=True)
