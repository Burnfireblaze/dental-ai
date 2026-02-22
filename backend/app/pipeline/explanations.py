from __future__ import annotations

from typing import Tuple


DOCTOR_TEMPLATES = {
    "Periapical Lesion": "Radiolucent area near the apex suggests periapical pathology.",
    "Deep Caries": "Radiolucency extending into dentin indicates advanced caries.",
    "Early Caries": "Subtle radiolucency in enamel suggests early caries.",
    "Bone Loss": "Crestal bone height reduction indicates periodontal bone loss.",
}

PATIENT_TEMPLATES = {
    "Periapical Lesion": "This area near the root tip looks infected and may need treatment.",
    "Deep Caries": "There is a deep cavity that likely needs prompt treatment.",
    "Early Caries": "A small cavity is starting to form and should be monitored.",
    "Bone Loss": "This area shows bone loss that may indicate gum disease.",
}


def generate_explanations(label: str) -> Tuple[str, str]:
    doctor = DOCTOR_TEMPLATES.get(label, "Finding detected on the radiograph requiring clinical review.")
    patient = PATIENT_TEMPLATES.get(label, "An area was found that your dentist will review and explain.")
    return doctor, patient
