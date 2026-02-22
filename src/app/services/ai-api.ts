import type {
  AnalyzeResponse,
  ApiCaseData,
  CaseData,
  Finding,
  FeedbackRequest,
  JobResponse,
  MetricsResponse,
  AssistantChatRequest,
  AssistantChatResponse,
} from '../types/ai';

const API_BASE = (import.meta as any).env?.VITE_AI_API_BASE_URL || 'http://localhost:8000';

const normalizeBase = (base: string) => base.replace(/\/$/, '');

const buildUrl = (path: string) => {
  const base = normalizeBase(API_BASE);
  if (path.startsWith('http')) return path;
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

const mapFinding = (finding: ApiCaseData['findings'][number]): Finding => ({
  id: finding.id,
  tooth: finding.tooth,
  label: finding.label,
  severity: finding.severity,
  confidence: Math.round(finding.confidence * 100),
  bbox: finding.bbox,
  polygon: finding.polygon,
  explanationDoctor: finding.explanation_doctor,
  explanationPatient: finding.explanation_patient,
  timeline: finding.timeline,
  action: finding.action,
  modality: finding.modality,
  status: finding.status ?? 'pending',
});

const mapCase = (data: ApiCaseData): CaseData => ({
  caseId: data.case_id,
  patientId: data.patient_id,
  createdAt: data.created_at,
  imageWidth: data.image_width,
  imageHeight: data.image_height,
  previewUrl: buildUrl(data.preview_url),
  findings: data.findings.map(mapFinding),
  measurements: {
    boneLossPercent: data.measurements?.bone_loss_percent ?? 0,
    byTooth: data.measurements?.by_tooth ?? {},
  },
  urgency: {
    level: data.urgency.level,
    score: data.urgency.score,
    timeline: data.urgency.timeline,
    action: data.urgency.action,
    summary: data.urgency.summary,
    priorityFindings: data.urgency.priority_findings,
    recommendation: data.urgency.recommendation,
  },
});

export async function analyzeXray(payload: {
  file: File;
  doctorNotes?: string;
  patientId?: string;
  modality?: string;
}): Promise<AnalyzeResponse> {
  const body = new FormData();
  body.append('file', payload.file);
  if (payload.doctorNotes) body.append('doctor_notes', payload.doctorNotes);
  if (payload.patientId) body.append('patient_id', payload.patientId);
  if (payload.modality) body.append('modality', payload.modality);

  const response = await fetch(buildUrl('/analyze-xray'), {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    throw new Error('Failed to upload X-ray');
  }
  return response.json();
}

export async function getJob(jobId: string): Promise<JobResponse> {
  const response = await fetch(buildUrl(`/analysis/${jobId}`));
  if (!response.ok) {
    throw new Error('Failed to fetch job status');
  }
  return response.json();
}

export async function getCase(caseId: string): Promise<CaseData | null> {
  const response = await fetch(buildUrl(`/cases/${caseId}`));
  if (response.status === 202) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch case data');
  }
  const data: ApiCaseData = await response.json();
  return mapCase(data);
}

export async function sendFeedback(payload: FeedbackRequest): Promise<void> {
  const response = await fetch(buildUrl('/feedback'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }
}

export async function getMetrics(): Promise<MetricsResponse> {
  const response = await fetch(buildUrl('/metrics'));
  if (!response.ok) {
    throw new Error('Failed to fetch metrics');
  }
  return response.json();
}

export async function chatAssistant(payload: AssistantChatRequest): Promise<AssistantChatResponse> {
  const response = await fetch(buildUrl('/assistant/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch assistant response');
  }
  return response.json();
}
