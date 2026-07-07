/**
 * API service layer — all backend communication in one place.
 * Talks to the FastAPI backend via the Vite dev proxy (/api → localhost:8000).
 */

const API_BASE = '/api';

// ── Types matching backend response shapes ──────────────────────────────

export interface ApiSubmissionResponse {
  id: string;
  extracted_concern: string;
  message: string;
}

export interface ApiSubmission {
  id: string;
  raw_input_type: string;
  raw_text: string | null;
  transcript: string | null;
  image_caption: string | null;
  extracted_concern: string;
  ward: string;
  constituency: string;
  submitted_at: string | null;
  cluster_id: number | null;
  language: string | null;
}

export interface ApiWardBreakdown {
  ward: string;
  score: number;
  frequency_component: number;
  population_component: number;
  infra_component: number;
}

export interface ApiClusterRanked {
  cluster_id: number;
  theme_label: string;
  score: number;
  submission_count: number;
  representative_concerns: string[];
  ward_breakdown: ApiWardBreakdown[];
}

export interface ApiClusterSummary {
  clusters_formed: number;
  submissions_clustered: number;
  noise_submissions: number;
  total_processed?: number;
  message?: string;
}

export interface ApiRankSummary {
  rankings_written: number;
  clusters_ranked: number;
  message?: string;
}

// ── API Functions ───────────────────────────────────────────────────────

/**
 * Submit a citizen grievance to the backend.
 * The backend will process it with Gemini AI (transcription/captioning/embedding).
 */
export async function submitGrievance(
  type: 'text' | 'voice' | 'photo',
  content: string,
  ward: string
): Promise<ApiSubmissionResponse> {
  const res = await fetch(`${API_BASE}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, content, ward }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Submission failed (${res.status})`);
  }

  return res.json();
}

/**
 * Fetch all submissions for a constituency.
 */
export async function fetchSubmissions(constituency: string): Promise<ApiSubmission[]> {
  const res = await fetch(
    `${API_BASE}/submissions?constituency=${encodeURIComponent(constituency)}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch submissions (${res.status})`);
  }

  return res.json();
}

/**
 * Fetch the ranked dashboard data for a constituency.
 */
export async function fetchDashboard(constituency: string): Promise<ApiClusterRanked[]> {
  const res = await fetch(
    `${API_BASE}/dashboard?constituency=${encodeURIComponent(constituency)}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard (${res.status})`);
  }

  return res.json();
}

/**
 * Trigger AI clustering of unclustered submissions.
 */
export async function triggerClustering(): Promise<ApiClusterSummary> {
  const res = await fetch(`${API_BASE}/cluster`, { method: 'POST' });

  if (!res.ok) {
    throw new Error(`Clustering failed (${res.status})`);
  }

  return res.json();
}

/**
 * Trigger priority ranking computation.
 */
export async function triggerRanking(): Promise<ApiRankSummary> {
  const res = await fetch(`${API_BASE}/rank`, { method: 'POST' });

  if (!res.ok) {
    throw new Error(`Ranking failed (${res.status})`);
  }

  return res.json();
}

/**
 * Full recompute pipeline: cluster → rank.
 * Returns both summaries.
 */
export async function recomputeAll(): Promise<{
  clustering: ApiClusterSummary;
  ranking: ApiRankSummary;
}> {
  const clustering = await triggerClustering();
  const ranking = await triggerRanking();
  return { clustering, ranking };
}
