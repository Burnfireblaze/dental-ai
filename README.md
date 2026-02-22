# DentAI (KrinosAI) — Clinical Intelligence Platform for Dental Imaging

DentAI is a full‑stack dental imaging platform that turns X‑ray uploads into structured findings, urgency insights, and clinician workflows. It includes AI detection, correction/feedback loops, **fine‑tuning from feedback**, analytics, and a context‑aware assistant.

---

## Contents

1. Overview
2. Features
3. Architecture
4. Local Setup
5. Environment Variables
6. API Endpoints
7. Feedback + Retraining
8. Reports (PDF)
9. Troubleshooting
10. Deployment Notes

---

## 1) Overview

DentAI provides:

- AI‑assisted detection + overlays
- Doctor review and correction workflow
- Patient‑friendly report view
- Admin analytics on AI performance
- AI assistant grounded in case history
- Feedback export and **YOLO fine‑tuning pipeline**

---

## 2) Features

### Doctor

- Upload X‑rays (PNG/JPG/DICOM)
- AI findings with confidence and urgency
- Accept / Reject / Correct findings
- Context‑aware AI assistant

### Patient

- Simplified report view with plain‑language explanations
- Report access only after doctor sharing

### Admin

- Metrics: acceptance rate, urgency distribution, corrections
- Feedback export for active learning

---

## 3) Architecture

- **Frontend:** React + TypeScript + Tailwind
- **Backend:** FastAPI + SQLite
- **AI:** YOLOv8 detection + optional secondary model
- **Assistant:** Groq API (optional) + structured DB context
- **Reports:** html2canvas + jsPDF

---

## 4) Local Setup

### Frontend

```bash
cd "/Users/sudarsan_srivathsun/Documents/Projects/AI Dental Agent v2"
npm install
npm run dev
```

### Backend

```bash
cd "/Users/sudarsan_srivathsun/Documents/Projects/AI Dental Agent v2/backend"
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## 5) Environment Variables

Frontend (.env):

```
VITE_AI_API_BASE_URL=http://localhost:8000
VITE_DEMO_AUTH=true
```

Backend (.env):

```
DATA_DIR=/Users/sudarsan_srivathsun/Documents/Projects/AI Dental Agent v2/backend/data
MODEL_DIR=/Users/sudarsan_srivathsun/Documents/Projects/AI Dental Agent v2/backend/models
DEVICE=cpu
ASYNC_PROCESSING=true
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=dev-secret-change-me
ACCESS_TOKEN_MINUTES=1440
PASSWORD_MIN_LENGTH=12
PASSWORD_MAX_BYTES=72
# Optional model paths
DETECTION_PRIMARY_MODEL_PATH=/path/to/best.pt
DETECTION_SECONDARY_MODEL_PATH=/path/to/secondary.pt
SEGMENTATION_MODEL_PATH=/path/to/nnunet
```

---

## 6) API Endpoints

- `POST /analyze-xray` → Upload and start analysis
- `GET /analysis/{job_id}` → Job status
- `GET /cases/{case_id}` → Case details
- `GET /cases/{case_id}/preview` → Preview image
- `GET /cases?limit=20` → Recent case summaries
- `POST /feedback` → Save corrections
- `GET /metrics` → Analytics
- `POST /assistant/chat` → Contextual assistant

Auth (available, but demo auth is used in frontend):

- `POST /auth/signup`
- `POST /auth/login`
- `GET /settings/profile`
- `POST /settings/profile`
- `POST /settings/change-password`

---

## 7) Feedback + Retraining

### Export feedback to YOLO dataset

```bash
cd backend
python scripts/export_cases_yolo.py --out data/yolo_export --labels config/yolo_classes.json
```

### Fine‑tune YOLO

```bash
python scripts/retrain_yolo.py
```

Outputs:

```
backend/data/training_runs/retrain/weights/best.pt
```

### Use retrained model

```bash
cp backend/data/training_runs/retrain/weights/best.pt \
   backend/models/dental_xray_ai_yolo_v8_finetuned.pt
```

Update `.env`:

```
DETECTION_PRIMARY_MODEL_PATH=/path/to/backend/models/dental_xray_ai_yolo_v8_finetuned.pt
```

Restart backend.

---

## 8) Reports (PDF)

Clinical report downloads are generated client‑side:

- **html2canvas** captures the report view
- **jsPDF** builds a multi‑page PDF

---

## 9) Troubleshooting

**Metrics show “Failed to fetch”**

- Ensure backend is running on `http://localhost:8000`
- Restart frontend after `.env` changes

**Retraining fails with no validation images**

- Run `export_cases_yolo.py` again (it auto‑seeds val now)

**PyTorch warnings about CUDA**

- CPU mode is expected on Apple Silicon

---

## 10) Deployment Notes

Models are large and **should not be pushed to Git**. Recommended approach:

- Upload models as **GitHub Release assets**
- Download at deploy time using a startup script
- Set `MODEL_DIR` in the deployment environment

---

## Code Map (What lives where)

### Backend (`backend/`)
- `app/main.py` → FastAPI routes (analysis, cases, metrics, assistant, auth)
- `app/settings.py` → environment config + defaults
- `app/schemas.py` → Pydantic request/response models
- `app/storage.py` → SQLite schema, queries, metrics aggregation
- `app/auth.py` → JWT + password hashing
- `app/jobs.py` → background job manager
- `app/assistant.py` → AI assistant context + Groq integration
- `app/pipeline/` → preprocessing, detection, segmentation, measurements
- `scripts/export_cases_yolo.py` → feedback → YOLO dataset export
- `scripts/retrain_yolo.py` → YOLO fine‑tuning on feedback dataset
- `config/yolo_classes.json` → label map used for retraining
- `models/` → model weights (not tracked in Git)
- `data/` → runtime DB, previews, results, active‑learning exports

### Frontend (`src/app/`)
- `pages/` → screen‑level views (home, dashboard, upload, analysis, reports)
- `components/` → reusable UI blocks (viewer, panels, layout)
- `services/` → API clients (`ai-api.ts`, `auth-api.ts`, `settings-api.ts`)
- `hooks/` → data hooks (`useCaseAnalysis`, `useCases`)
- `types/` → shared TypeScript interfaces
- `contexts/` → role + auth UI context

### Root
- `.env` → local config for frontend + backend
- `Dockerfile` → backend container build
- `README.md` → setup + API + retraining docs

---

## Feature Map (Which file handles what)

### Core flows
- **Login / Signup (Demo Auth)** → `src/app/pages/login-screen.tsx`, `src/app/pages/signup-screen.tsx`, `src/app/services/auth-api.ts`
- **Role UI Switcher** → `src/app/components/layout/role-switcher.tsx`, `src/app/contexts/role-context.tsx`
- **Upload X‑ray** → `src/app/pages/upload-screen.tsx` → backend `POST /analyze-xray` (`backend/app/main.py`)
- **Analysis Workspace** → `src/app/pages/analysis-workspace.tsx`
- **X‑ray Viewer + Overlays** → `src/app/components/analysis/xray-viewer.tsx`
- **Findings Panel** → `src/app/components/analysis/findings-tab.tsx`
- **Findings Review / Batch Actions** → `src/app/pages/findings-review.tsx`
- **Correction Form** → `src/app/components/findings/correction-form.tsx`
- **AI Assistant (Doctor)** → `src/app/pages/ai-assistant.tsx` + `backend/app/assistant.py`
- **AI Assistant (Case Tab)** → `src/app/components/analysis/ai-assistant-tab.tsx`
- **Clinical Report** → `src/app/pages/clinical-report.tsx` (PDF download)
- **Patient Report** → `src/app/pages/patient-report.tsx`

### Doctor dashboards
- **Home (Recent Cases + Alerts)** → `src/app/pages/home-screen.tsx` → backend `GET /cases`
- **Dashboard Overview** → `src/app/pages/dashboard-screen.tsx` → backend `GET /metrics` + `GET /cases`
- **Stats & Calibration** → `src/app/pages/stats-calibration.tsx` → backend `GET /metrics`

### Admin / Analytics
- **Admin Dashboards** → `src/app/pages/admin-*.tsx`
- **Metrics API** → `backend/app/storage.py` (`build_metrics`) + `backend/app/main.py` (`GET /metrics`)

### AI Pipeline
- **Preprocess (DICOM, CLAHE)** → `backend/app/pipeline/preprocess.py`
- **Detection (YOLO)** → `backend/app/pipeline/detection.py`
- **Segmentation (nnU‑Net stub)** → `backend/app/pipeline/segmentation.py`
- **Measurements** → `backend/app/pipeline/measurements.py`
- **Postprocess / Urgency** → `backend/app/pipeline/urgency.py`, `backend/app/pipeline/postprocess.py`
- **Pipeline Orchestration** → `backend/app/pipeline/__init__.py`

### Feedback + Retraining
- **Feedback API** → `backend/app/main.py` (`POST /feedback`)
- **Feedback storage + export** → `backend/app/storage.py` + `backend/data/active_learning/`
- **YOLO Export** → `backend/scripts/export_cases_yolo.py`
- **YOLO Fine‑tune** → `backend/scripts/retrain_yolo.py`
- **Label map** → `backend/config/yolo_classes.json`
- Export doctor correction data for future model retraining

---

## How We Built It

The architecture has **five distinct intelligence layers**, each doing one job exceptionally well.

### Layer 1 — Multi-Model Vision Router

Rather than using a single model for all dental images, we built an **image classifier** that detects the modality first, then routes to the best specialized model:

$$\text{Model}(x) = \begin{cases} \text{YOLOv8-DENTEX} & \text{if } \frac{w}{h} > 2.2 \text{ (panoramic)} \\ \text{YOLOv8-Bitewing} & \text{if square, large field} \\ \text{YOLOv8-Periapical} & \text{if square, small field} \\ \text{YOLOv8-Intraoral} & \text{if color image} \end{cases}$$

Each model adds **modality-specific fields** on top of the base detection schema — periapical detections include `root_involvement` and `estimated_lesion_size`; bitewing detections include `surface` (mesial/distal/occlusal) and `depth` (enamel/dentin/pulp).

All models run on **CPU only** — no GPU required. Pretrained weights from the DENTEX dataset and community fine-tunes on HuggingFace.

### Layer 2 — Urgency Engine

Every detection is scored $u \in \{1, 2, 3, 4, 5\}$ using a composite clinical scoring function:

$$u = \text{clamp}\left(u_{\text{base}} + \delta_{\text{conf}} + \delta_{\text{tooth}} + \delta_{\text{co-occur}} + \delta_{\text{depth}} + \delta_{\text{lesion}},\ 1,\ 5\right)$$

Where:

- $u_{\text{base}}$ = base urgency by disease class (e.g., deep caries = 4, caries = 2)
- $\delta_{\text{conf}} = +1$ if confidence $> 0.85$, $-1$ if $< 0.45$
- $\delta_{\text{tooth}} = +1$ if FDI tooth is clinically high-value $\{11, 12, 16, 21, 22, 26, 36, 46...\}$
- $\delta_{\text{co-occur}} = +1$ if 2+ severe co-occurring conditions
- $\delta_{\text{depth}}$ = bitewing-specific caries depth modifier
- $\delta_{\text{lesion}}$ = periapical lesion size modifier

The session-level urgency aggregates individual scores into an overall triage decision with a natural language narrative.

### Layer 3 — Confidence Bias (Adaptive Calibration)

The system tracks each doctor's correction history and maintains a per-disease bias:

$$b_d = \text{clamp}\left(\left(\frac{A_d}{A_d + R_d + C_d} - 0.6\right) \times 0.5,\ -0.3,\ +0.3\right)$$

Where $A_d$, $R_d$, $C_d$ are accept, reject, and correct counts for disease $d$. The adjusted confidence shown to the doctor is $\hat{p} = \text{clamp}(p + b_d,\ 0.01,\ 0.99)$.

This means the system literally gets sharper for each specific doctor over time — without any retraining.

### Layer 4 — Agentic AI Layer

We built a **LangChain AgentExecutor** with 8 real tools backed by live data:

| Tool                              | Does                                                   |
| --------------------------------- | ------------------------------------------------------ |
| `get_urgency_assessment`          | Loads session urgency + priority queue                 |
| `get_current_detections`          | Returns structured finding list                        |
| `search_similar_cases`            | Queries ChromaDB vector store                          |
| `calculate_treatment_plan`        | Groups findings by urgency into treatment tiers        |
| `generate_differential_diagnosis` | Sub-calls Claude Haiku for ranked differentials        |
| `get_doctor_tendencies`           | Retrieves this doctor's historical correction patterns |
| `get_modality_context`            | Returns image-type-specific clinical context           |
| `get_feedback_stats`              | Returns acceptance rate and correction patterns        |

Claude (Sonnet) serves as the reasoning brain inside LangChain's orchestration loop. The agent **decides which tools to call** based on the doctor's natural language question — it doesn't simulate tool use, it actually calls Python functions hitting live SQLite and ChromaDB data.

### Layer 5 — Role-Based Access Control (RBAC)

Three roles — **Doctor, Patient, Admin** — with permission enforcement on every endpoint via request headers. Patients only see reports after explicit doctor sharing. Agents respond differently by role: clinical terminology for doctors, plain English for patients.

### Clinical Summary (LLM Pipeline)

After finding approval, the summarization pipeline is:

```
Approved Findings (JSON)
        ↓
Build Clinical Prompt
        ↓
Try Ollama/phi3:mini → HuggingFace/Phi-3-mini → Rule-based fallback
        ↓
Parse LLM Response → Structured Sections
        ↓
{overview, key_findings, treatment_priorities, next_steps, follow_up}
```

### Tech Stack

| Layer                | Technology                                          |
| -------------------- | --------------------------------------------------- |
| Vision Models        | YOLOv8 (Ultralytics) — DENTEX pretrained weights    |
| Backend              | FastAPI + Python                                    |
| Agent Orchestration  | LangChain + Claude API (Anthropic)                  |
| Clinical Summary LLM | Ollama / phi3:mini (local, CPU)                     |
| Vector Database      | ChromaDB (similar case retrieval)                   |
| Persistent Storage   | SQLite                                              |
| Frontend             | React + TypeScript + Tailwind CSS (Figma-generated) |
| Build Tool           | Vite                                                |

---

## Challenges We Ran Into

**1. One model can't do everything.**
Our biggest early mistake was assuming a single YOLOv8 model could handle all four dental image types. A panoramic X-ray and a periapical X-ray look nothing alike to a neural network. The panoramic model was producing garbage on periapical images because it had never seen a close-up of a single root apex. Building the classifier + router system and getting all four models to produce a unified output schema took significant iteration.

**2. FDI tooth numbering from pixel coordinates.**
Assigning the correct FDI tooth number from a bounding box center required understanding the spatial layout of panoramic radiology — upper arch runs $18 \rightarrow 28$ left to right, lower arch runs $48 \rightarrow 38$ left to right, with the midline at image center. Getting the heuristic mapping accurate enough to be clinically meaningful (not just directionally correct) was harder than expected.

**3. LangChain tool calling reliability.**
Early versions of the agent would sometimes decide not to call tools and just reason from memory — giving confident but fabricated clinical answers. We solved this by being extremely explicit in the system prompt about when tools are mandatory, and by adding `handle_parsing_errors=True` to catch and retry malformed tool calls.

**4. Running everything on CPU.**
We had no GPU budget. Every model — YOLOv8, the LLM summarizer, the HuggingFace fallback — had to work on CPU in reasonable time. Phi-3 Mini via Ollama turned out to be the key discovery here: it runs comfortably on a MacBook CPU, produces genuinely useful clinical text, and takes ~20 seconds per summary — acceptable for a real clinical workflow.

**5. Role-aware agent responses.**
Making the same agent produce meaningfully different responses for a doctor vs. a patient required careful prompt engineering. Early attempts produced responses that were either too clinical for patients or too dumbed-down for doctors. The breakthrough was treating it as a context-injection problem: the `user_role` field is passed in every chat call and the system prompt gives explicit behavioral rules per role.

**6. Patient data privacy in the UI.**
Ensuring patients couldn't access unshared reports required permission checks not just on the backend but also graceful handling in the frontend — showing "Report not yet shared by your dentist" rather than a generic 403 error. Getting that UX right while keeping the backend clean took multiple iterations.

---

## Accomplishments That We're Proud Of

- **Multi-model routing that actually works** — uploading a periapical X-ray and seeing the system correctly classify it, run the right model, and return root involvement depth and lesion size estimates feels genuinely useful.

- **The confidence bias layer** — watching a model's displayed confidence for caries drop in real time after a doctor rejects three consecutive caries predictions is the clearest demonstration of adaptive AI we've built.

- **Agent tool transparency** — when the agent calls `search_similar_cases` and `calculate_treatment_plan` and the frontend shows those tool pills next to the response, you understand exactly how the answer was constructed. No black box.

- **Three completely different experiences from one codebase** — switching from Doctor to Patient role and watching the exact same X-ray produce clinical FDI-numbered findings in one view and "tooth decay on your back lower molar" in another is something we're genuinely proud of.

- **Zero-GPU, zero-internet summarization** — the clinical summary runs entirely locally, on CPU, with no API key and no internet connection required. A clinic in a rural area with no cloud access can still use the summary feature.

- **The full RBAC + share flow** — doctor reviews findings, clicks Share, switches to patient view, sees the report appear. That's a real clinical workflow, not a demo shortcut.

---

## What We Learned

**AI in healthcare is a UX problem as much as an ML problem.**
The hardest part wasn't building the models — it was making sure the output was presented in a way that augments clinical judgment rather than replacing it. A 94% confidence score means nothing to a dentist unless it's accompanied by the reasoning behind it. The explainability layer (tool calls visible in the UI, modality context in the agent) matters as much as the accuracy.

**Small models are underrated.**
Phi-3 Mini at 3.8B parameters, running locally on CPU, produces clinical summaries that are genuinely useful. The field is obsessed with larger models, but for a specific, well-constrained task like "summarize these 4 dental findings into a structured report," a small specialized model is often better than a giant general one — and dramatically more deployable.

**Active learning is a product feature, not just an ML technique.**
The confidence bias layer isn't just technically interesting — it's a _selling point_. Telling a dentist "this system will adjust to your diagnostic style over time" changes their relationship with the tool from skepticism to investment. They become stakeholders in its improvement.

**Agentic AI needs guardrails, not just tools.**
Giving an agent 8 tools and telling it to "figure it out" produces unpredictable behavior. The breakthrough was being explicit: tell the agent exactly when each tool is mandatory, what to do first when urgency is critical, and how to behave differently by role. The system prompt is as important as the tools themselves.

**Role-based design forces you to deeply understand your users.**
Building three separate role experiences forced us to ask: what does a patient actually need to know? What is clinically important vs. what is just noise? Those questions made every feature better — not just the patient portal.

---

## What's Next for DentAI

**Longitudinal patient tracking** — comparing findings across multiple visits for the same patient to detect disease progression. A caries detected at Moderate urgency in November that becomes Severe by February is a fundamentally different clinical signal than a new finding.

**GradCAM explainability** — adding heatmap overlays so dentists can see _exactly which pixels_ drove each detection. The single most requested feature in clinical AI adoption research is "show me why."

**Real fine-tuning pipeline** — the feedback database is already collecting every doctor correction. The next step is a scheduled LoRA fine-tuning job that runs offline on collected corrections and updates the deployed model weights. The active learning loop is architecturally complete — it just needs the training compute step.

**Voice-first interaction** — a dentist's hands are busy during examination. Web Speech API integration would let them say _"reject tooth 36, that's a restoration artifact"_ and have the system update accordingly.

**DICOM support** — real clinical environments use DICOM format, not JPEG. Adding a DICOM parser would make the platform deployable in actual clinic PACS systems.

**Multi-language patient reports** — the patient portal's plain-language summaries are one translation step away from serving non-English-speaking patients. A significant equity opportunity.

**Federated learning** — allow multiple clinics to contribute correction data to model improvement without sharing patient images. Privacy-preserving improvement at scale.

---
