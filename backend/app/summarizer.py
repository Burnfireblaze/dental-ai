"""
summarizer.py

Generates clinical dental summaries from approved findings using the Groq
hosted LLM API. Falls back to a rule-based template to ensure a response
is always returned.

Priority order:
  1. Groq API (chat completions)
  2. Rule-based template (always available)
"""

from __future__ import annotations

import json
import logging
import os
from typing import Any, Dict, List, Optional

import httpx

logger = logging.getLogger(__name__)

# --------------------------------------------------------------------------- #
# Constants
# --------------------------------------------------------------------------- #

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "phi3:mini")
HF_MODEL_ID = os.getenv("HF_MODEL_ID", "microsoft/Phi-3-mini-4k-instruct")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

SEVERITY_SCORES = {
    "urgent": 3,
    "attention": 2,
    "moderate": 2,
    "routine": 1,
    "low": 1,
}

# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #


def _severity_score(severity: str | None) -> int:
    if not severity:
        return 1
    return SEVERITY_SCORES.get(severity.lower(), 1)


def _derive_risk_and_urgency(findings: List[Dict[str, Any]]) -> tuple[str, str]:
    max_score = max((_severity_score(f.get("severity")) for f in findings), default=1)
    if max_score >= 3:
        return "High", "Immediate"
    if max_score == 2:
        return "Moderate", "Soon"
    return "Low", "Routine"


def _derive_actions(findings: List[Dict[str, Any]]) -> List[str]:
    actions: List[str] = []
    for f in findings:
        label = (f.get("label") or "Finding").lower()
        tooth = f.get("tooth") or f.get("fdi_tooth") or "?"
        if "caries" in label or "cavity" in label:
            actions.append(f"Restore carious lesion on tooth {tooth}; assess depth before prep")
        elif "abscess" in label or "periapical" in label:
            actions.append(f"Endodontic evaluation for tooth {tooth}; initiate drainage if symptomatic")
        elif "bone" in label:
            actions.append("Periodontal evaluation with scaling/root planing as indicated")
        elif "impacted" in label:
            actions.append(f"Surgical consult for impacted tooth {tooth}")
        else:
            actions.append(f"Clinical exam and treatment plan for tooth {tooth} ({label})")

    if not actions:
        actions.append("Continue routine preventive care and monitoring")

    seen = set()
    unique_actions: List[str] = []
    for act in actions:
        if act in seen:
            continue
        seen.add(act)
        unique_actions.append(act)
    return unique_actions


def _build_prompt(findings: List[Dict[str, Any]], doctor_notes: str = "", image_type: str = "panoramic") -> str:
    if not findings:
        return ""

    lines = []
    for idx, f in enumerate(findings, 1):
        tooth = f.get("tooth") or f.get("fdi_tooth") or "?"
        label = f.get("label") or f.get("disease") or "finding"
        severity = f.get("severity") or "moderate"
        conf = f.get("confidence")
        conf_txt = f" (confidence: {conf:.0%})" if isinstance(conf, (int, float)) else ""
        lines.append(f"{idx}. Tooth {tooth}: {label} (severity: {severity}{conf_txt})")

    notes_block = f"\nDoctor notes: {doctor_notes}\n" if doctor_notes else ""

    prompt = f"""
Explain the following approved dental radiographic findings from a {image_type} image.
Return a concise JSON object with keys: clinical_summary (string, 3-5 sentences),
patient_explanation (2-3 sentences, non-technical), recommended_actions (array of short actions).
Findings:\n{os.linesep.join(lines)}{notes_block}
Respond with ONLY JSON and no additional text.
"""
    return prompt.strip()


def _parse_llm_json(text: str) -> Optional[Dict[str, Any]]:
    if not text:
        return None
    text = text.strip()
    try:
        return json.loads(text)
    except Exception:
        pass

    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        snippet = text[start : end + 1]
        try:
            return json.loads(snippet)
        except Exception:
            return None
    return None


# --------------------------------------------------------------------------- #
# Ollama
# --------------------------------------------------------------------------- #


def _call_ollama(prompt: str) -> Optional[str]:
    try:
        with httpx.Client(timeout=120.0) as client:
            tags = client.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=3.0)
            if tags.status_code != 200:
                return None

            models = [m.get("name") for m in tags.json().get("models", [])]
            if OLLAMA_MODEL not in models:
                try:
                    client.post(
                        f"{OLLAMA_BASE_URL}/api/pull",
                        json={"name": OLLAMA_MODEL, "stream": False},
                        timeout=300.0,
                    )
                except Exception:
                    logger.warning("Could not pull Ollama model")

            resp = client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"temperature": 0.3, "top_p": 0.9, "num_predict": 600},
                },
                timeout=120.0,
            )
            if resp.status_code == 200:
                return resp.json().get("response", "").strip()
    except Exception as exc:  # pragma: no cover - best effort
        logger.warning("Ollama unavailable: %s", exc)
    return None


# --------------------------------------------------------------------------- #
# HuggingFace
# --------------------------------------------------------------------------- #

_hf_pipeline = None  # lazy


def _call_huggingface(prompt: str) -> Optional[str]:
    global _hf_pipeline
    try:
        from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
        import torch

        if _hf_pipeline is None:
            logger.info("Loading HuggingFace model %s", HF_MODEL_ID)
            model = AutoModelForCausalLM.from_pretrained(HF_MODEL_ID, torch_dtype=torch.float32)
            tokenizer = AutoTokenizer.from_pretrained(HF_MODEL_ID)
            _hf_pipeline = pipeline("text-generation", model=model, tokenizer=tokenizer, device_map="cpu")

        result = _hf_pipeline(prompt, max_new_tokens=400, temperature=0.3, do_sample=True)
        if result and isinstance(result, list):
            generated = result[0].get("generated_text")
            if isinstance(generated, str):
                return generated.replace(prompt, "", 1).strip()
    except Exception as exc:  # pragma: no cover - best effort
        logger.warning("HuggingFace fallback failed: %s", exc)
    return None


# --------------------------------------------------------------------------- #
# Groq (primary)
# --------------------------------------------------------------------------- #


def _call_groq(prompt: str) -> Optional[str]:
    if not GROQ_API_KEY:
        return None
    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
        }
        body = {
            "model": GROQ_MODEL,
            "messages": [
                {"role": "system", "content": "You are an expert dental radiologist."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.3,
            "max_tokens": 600,
        }
        with httpx.Client(timeout=60.0) as client:
            resp = client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=body)
            if resp.status_code != 200:
                logger.warning("Groq error status %s: %s", resp.status_code, resp.text[:200])
                return None
            data = resp.json()
            choices = data.get("choices") or []
            if not choices:
                return None
            return (choices[0].get("message") or {}).get("content", "").strip()
    except Exception as exc:  # pragma: no cover
        logger.warning("Groq unavailable: %s", exc)
        return None


# --------------------------------------------------------------------------- #
# Rule-based fallback
# --------------------------------------------------------------------------- #


def _rule_based_summary(findings: List[Dict[str, Any]], doctor_notes: str = "") -> Dict[str, Any]:
    if not findings:
        return {
            "clinical_summary": "No significant radiographic findings reported.",
            "patient_explanation": "Your recent dental images did not show any problems that need treatment.",
            "recommended_actions": ["Maintain routine hygiene and regular check-ups."],
            "risk_level": "Low",
            "urgency": "Routine",
        }

    risk, urgency = _derive_risk_and_urgency(findings)

    bullet_parts = []
    for f in findings:
        tooth = f.get("tooth") or f.get("fdi_tooth") or "?"
        label = f.get("label") or f.get("disease") or "finding"
        severity = f.get("severity") or "moderate"
        bullet_parts.append(f"Tooth {tooth}: {label} ({severity}).")

    clinical_summary = " ".join(bullet_parts)
    if doctor_notes:
        clinical_summary += f" Notes: {doctor_notes}."

    patient_explanation = (
        "We found a few areas that need attention: "
        + " ".join(bullet_parts)
        + " Your dentist will discuss treatment and timing with you."
    )

    return {
        "clinical_summary": clinical_summary.strip(),
        "patient_explanation": patient_explanation.strip(),
        "recommended_actions": _derive_actions(findings),
        "risk_level": risk,
        "urgency": urgency,
    }


# --------------------------------------------------------------------------- #
# Public API
# --------------------------------------------------------------------------- #


def generate_summary(
    findings: List[Dict[str, Any]],
    patient_id: Optional[str] = None,
    doctor_notes: str = "",
    image_type: str = "panoramic",
) -> Dict[str, Any]:
    """
    Try Groq → rule-based to produce structured summary.
    Always returns a dict ready for JSONResponse.
    """

    risk_level, urgency = _derive_risk_and_urgency(findings)

    prompt = _build_prompt(findings, doctor_notes=doctor_notes, image_type=image_type)
    llm_text = _call_groq(prompt) if prompt else None

    parsed = _parse_llm_json(llm_text or "") if llm_text else None

    clinical_summary = None
    patient_explanation = None
    actions: Optional[List[str]] = None

    if parsed:
        clinical_summary = parsed.get("clinical_summary") or parsed.get("summary")
        patient_explanation = parsed.get("patient_explanation") or parsed.get("patient_summary")
        actions = parsed.get("recommended_actions") or parsed.get("actions")

    if not clinical_summary or not patient_explanation:
        fallback = _rule_based_summary(findings, doctor_notes)
        clinical_summary = clinical_summary or fallback.get("clinical_summary", "")
        patient_explanation = patient_explanation or fallback.get("patient_explanation", "")
        actions = actions or fallback.get("recommended_actions", [])
        risk_level = fallback.get("risk_level", risk_level)
        urgency = fallback.get("urgency", urgency)

    if not isinstance(actions, list):
        actions = [str(actions)] if actions else _derive_actions(findings)

    clinical_summary = str(clinical_summary).strip()
    patient_explanation = str(patient_explanation).strip()

    return {
        "patient_id": patient_id,
        "clinical_summary": clinical_summary,
        "risk_level": risk_level,
        "urgency": urgency,
        "patient_explanation": patient_explanation,
        "recommended_actions": actions,
    }
