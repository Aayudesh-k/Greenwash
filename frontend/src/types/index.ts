// Backend API response types
export interface ClaimVerdict {
  claim: string;
  synthesis: string;
  status: "Verified" | "Contradicted" | "Unsubstantiated" | "Error";
}

export interface FinalAssessment {
  greenwash_score: number; // 0-10 scale
  summary: string;
}

export interface Claim {
  text: string;
  reference: string;
}

export interface EvidenceItem {
  claim_text: string;
  snippet: string;
  source: string;
  weight: number;
  note?: string;
}

export interface RetrievedDoc {
  page_content: string;
  metadata: {
    source: string;
    page: string | number;
  };
}

export interface AnalysisResponse {
  status: "running" | "completed" | "failed";
  final_report?: ClaimVerdict[];
  final_assessment?: FinalAssessment;
  themes?: string[];
  claims?: Claim[];
  search_queries?: string[];
  retrieved_docs?: RetrievedDoc[];
  evidence?: EvidenceItem[];
  error?: string;
}

export interface SubmitAnalysisRequest {
  company_name: string;
}

export interface SubmitAnalysisResponse {
  task_id: string;
}

// Frontend state types
export interface AnalysisState {
  taskId: string | null;
  status: "idle" | "running" | "completed" | "failed";
  data: AnalysisResponse | null;
  error: string | null;
}
