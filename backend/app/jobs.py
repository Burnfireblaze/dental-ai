from __future__ import annotations

import traceback
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Optional, Dict, Any

from . import storage
from .pipeline import run_pipeline
from .settings import settings


class JobManager:
    def __init__(self, max_workers: int = 2) -> None:
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

    def submit(self, job_id: str, case_id: str, image_path: Path) -> None:
        self.executor.submit(self._run_job, job_id, case_id, image_path)

    def _run_job(self, job_id: str, case_id: str, image_path: Path) -> None:
        try:
            storage.update_job(job_id, "processing", 10)
            result, _ = run_pipeline(image_path=image_path, model_dir=settings.model_dir, device=settings.device)
            storage.update_job(job_id, "processing", 80)
            storage.update_case_result(case_id, result)
            storage.update_job(job_id, "complete", 100)
        except Exception as exc:
            storage.update_job(job_id, "failed", 100, error=str(exc))
            storage.update_case_status(case_id, "failed")
            traceback.print_exc()

    def shutdown(self) -> None:
        self.executor.shutdown(wait=False)
