export type Severity = "urgent" | "attention" | "routine";
export type FindingStatus = "pending" | "accepted" | "rejected" | "corrected";
export type JobStatus = "queued" | "processing" | "complete" | "failed";

export interface ApiFinding {
  id: number;
  tooth: number;
  label: string;
  severity: Severity;
  confidence: number;
  bbox: [number, number, number, number];
  polygon?: [number, number][];
  explanation_doctor?: string;
  explanation_patient?: string;
  timeline?: string;
  action?: string;
  modality?: string;
  status?: FindingStatus;
}

export interface ApiMeasurements {
  bone_loss_percent: number;
  by_tooth: Record<string, number>;
}

export interface ApiUrgency {
  level: Severity;
  score: number;
  timeline: string;
  action: string;
  summary: string;
  priority_findings: string[];
  recommendation: string;
}

export interface ApiCaseData {
  case_id: string;
  patient_id?: string | null;
  created_at: string;
  image_width: number;
  image_height: number;
  preview_url: string;
  findings: ApiFinding[];
  measurements: ApiMeasurements;
  urgency: ApiUrgency;
}

export interface Finding {
  id: number;
  tooth: number;
  label: string;
  severity: Severity;
  confidence: number; // 0-100
  bbox: [number, number, number, number];
  polygon?: [number, number][];
  explanationDoctor?: string;
  explanationPatient?: string;
  timeline?: string;
  action?: string;
  modality?: string;
  status: FindingStatus;
}

export interface Measurements {
  boneLossPercent: number;
  byTooth: Record<string, number>;
}

export interface Urgency {
  level: Severity;
  score: number;
  timeline: string;
  action: string;
  summary: string;
  priorityFindings: string[];
  recommendation: string;
}

export interface CaseData {
  caseId: string;
  patientId?: string | null;
  createdAt: string;
  imageWidth: number;
  imageHeight: number;
  previewUrl: string;
  findings: Finding[];
  measurements: Measurements;
  urgency: Urgency;
}

export interface AnalyzeResponse {
  case_id: string;
  job_id: string;
  status: JobStatus;
  progress: number;
  preview_url: string;
  poll_url: string;
}

export interface JobResponse {
  job_id: string;
  case_id: string;
  status: JobStatus;
  progress: number;
  error?: string | null;
  result_url?: string | null;
}

export type FeedbackActionType =
  | "accept"
  | "reject"
  | "correct"
  | "set_routine"
  | "add_missing";

export interface FeedbackAction {
  finding_id?: number;
  action: FeedbackActionType;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
  notes?: string;
}

export interface FeedbackRequest {
  case_id: string;
  doctor_id?: string;
  actions: FeedbackAction[];
}

export interface MetricCalibrationItem {
  category: string;
  accepted: number;
  corrected: number;
  rejected: number;
  accuracy: number;
}

export interface MetricUrgencyItem {
  level: string;
  count: number;
  percentage: number;
}

export interface MetricCorrectionItem {
  id: number;
  condition: string;
  original_tooth?: string;
  corrected_tooth?: string;
  change?: string;
  date: string;
}

export interface MetricsResponse {
  sessions_analyzed: number;
  acceptance_rate: number;
  corrections_made: number;
  average_urgency: number;
  average_confidence: number;
  total_findings: number;
  feedback_count: number;
  calibration: MetricCalibrationItem[];
  urgency_distribution: MetricUrgencyItem[];
  recent_corrections: MetricCorrectionItem[];
}

export interface CaseSummary {
  caseId: string;
  patientId?: string | null;
  createdAt: string;
  status?: string | null;
  urgencyLevel?: string | null;
  findingsCount: number;
  summary: string;
  previewUrl?: string | null;
}

export interface CasesResponse {
  cases: {
    case_id: string;
    patient_id?: string | null;
    created_at: string;
    status?: string | null;
    urgency_level?: string | null;
    findings_count: number;
    summary: string;
    preview_url?: string | null;
  }[];
}

export interface AssistantMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantChatRequest {
  message: string;
  case_id?: string | null;
  doctor_name?: string | null;
  history?: AssistantMessage[];
}

export interface AssistantChatResponse {
  response: string;
  tools_used: string[];
}

export interface SummaryResponse {
  patientId?: string | null;
  clinicalSummary: string;
  riskLevel: string;
  urgency: string;
  patientExplanation: string;
  recommendedActions: string[];
}
