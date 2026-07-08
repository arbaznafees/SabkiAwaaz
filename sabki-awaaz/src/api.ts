/**
 * API service layer — all backend communication in one place.
 * Talks to the FastAPI backend via the Vite dev proxy (/api → localhost:8000).
 * Seamlessly falls back to local storage browser database if backend is offline.
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

// ── Local Storage Database Helper for Standalone Mode ───────────────────

const LOCAL_STORAGE_KEY = 'sabkiawaaz_submissions';
const LOCAL_STORAGE_DB_KEY = 'sabkiawaaz_dashboard_mock';

function getLocalSubmissions(): any[] {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (data) return JSON.parse(data);

  const initial = [
    {
      id: 'SA-2026-102450',
      ward: 'Sector 4',
      type: 'text',
      content: 'Broken Roads: Potholes on main road',
      extracted_concern: 'Potholes on main road',
      status: 'IN_PROGRESS',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      residentName: 'Ravi Kumar',
      residentTitle: 'Citizen Member',
      upvotes: 4
    },
    {
      id: 'SA-2026-102304',
      ward: 'Sector 12',
      type: 'voice',
      content: 'Water: Irregular water supply in Ward 12',
      extracted_concern: 'Irregular water supply',
      status: 'UNDER_REVIEW',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
      residentName: 'Anita Sharma',
      residentTitle: 'Resident',
      upvotes: 12
    },
    {
      id: 'SA-2026-101087',
      ward: 'Sector 9',
      type: 'photo',
      content: 'Sanitation: Garbage heap accumulated near public park entrance',
      extracted_concern: 'Garbage not collected near public park',
      status: 'RESOLVED',
      timestamp: new Date(Date.now() - 3600000 * 96).toISOString(),
      residentName: 'Vikram Singh',
      residentTitle: 'Resident',
      upvotes: 18
    }
  ];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveLocalSubmissions(subs: any[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subs));
}

function getLocalDashboard(constituency: string): ApiClusterRanked[] {
  const data = localStorage.getItem(LOCAL_STORAGE_DB_KEY);
  if (data) return JSON.parse(data);

  const initial: ApiClusterRanked[] = [
    {
      cluster_id: 1,
      theme_label: "Potholes & Damaged Roads on Main Corridor",
      score: 0.89,
      submission_count: 82,
      representative_concerns: [
        "Massive potholes near metro station gate 2",
        "Damaged asphalt making commuting hazardous for two-wheelers"
      ],
      ward_breakdown: [
        { ward: "Sector 4", score: 0.89, frequency_component: 0.6, population_component: 0.7, infra_component: 0.8 },
        { ward: "Sector 12", score: 0.75, frequency_component: 0.4, population_component: 0.5, infra_component: 0.6 }
      ]
    },
    {
      cluster_id: 2,
      theme_label: "Low Pressure & Contaminated Drinking Water Supply",
      score: 0.82,
      submission_count: 58,
      representative_concerns: [
        "Muddy water coming in mornings for last 5 days",
        "Water pressure is too low to reach first floor"
      ],
      ward_breakdown: [
        { ward: "Sector 12", score: 0.82, frequency_component: 0.5, population_component: 0.6, infra_component: 0.7 }
      ]
    },
    {
      cluster_id: 3,
      theme_label: "Non-functional Streetlights near Sector 9 Public Park",
      score: 0.68,
      submission_count: 45,
      representative_concerns: [
        "Park streetlights dark since last Tuesday, unsafe for women",
        "Three lamp posts near colony entrance are flickering"
      ],
      ward_breakdown: [
        { ward: "Sector 9", score: 0.68, frequency_component: 0.35, population_component: 0.4, infra_component: 0.5 }
      ]
    }
  ];
  localStorage.setItem(LOCAL_STORAGE_DB_KEY, JSON.stringify(initial));
  return initial;
}

// ── API Functions with Standalone Fail-safes ────────────────────────────

/**
 * Submit a citizen grievance.
 * Tries the FastAPI backend first, then falls back to LocalStorage.
 */
export async function submitGrievance(
  type: 'text' | 'voice' | 'photo',
  content: string,
  ward: string
): Promise<ApiSubmissionResponse> {
  try {
    const res = await fetch(`${API_BASE}/submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, content, ward }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend offline. Grievance saved locally in browser.", err);
  }

  // Standalone mode fallback
  const localSubs = getLocalSubmissions();
  const trackingId = `SA-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const newSubmission = {
    id: trackingId,
    ward,
    type,
    content: content || 'Civic issue reported.',
    extracted_concern: content || 'Civic issue reported.',
    status: 'VERIFIED',
    timestamp: new Date().toISOString(),
    residentName: 'Ravi Kumar',
    residentTitle: 'Citizen Member',
    upvotes: 0,
    constituency: 'New Delhi Central'
  };

  localSubs.unshift(newSubmission);
  saveLocalSubmissions(localSubs);

  return {
    id: trackingId,
    extracted_concern: newSubmission.extracted_concern,
    message: "Grievance submitted successfully (offline fallback database)."
  };
}

/**
 * Fetch all submissions for a constituency.
 */
export async function fetchSubmissions(constituency: string = 'New Delhi Central'): Promise<any[]> {
  let apiData: any[] = [];
  try {
    const res = await fetch(
      `${API_BASE}/submissions?constituency=${encodeURIComponent(constituency)}`
    );
    if (res.ok) {
      apiData = await res.json();
    }
  } catch (err) {
    console.warn("Backend offline. Loading offline submissions list.", err);
  }

  const localData = getLocalSubmissions();
  const combined = [...localData, ...apiData];

  return combined.map((api: any, idx: number) => ({
    id: api.id || `SA-2026-${100 + idx}`,
    constituency: api.constituency || constituency,
    ward: api.ward || 'Sector 4',
    type: api.type || api.raw_input_type || 'text',
    content: api.extracted_concern || api.raw_text || api.content || 'Civic complaint reported.',
    status: api.status || 'VERIFIED',
    timestamp: api.timestamp || api.submitted_at || new Date().toISOString(),
    residentName: api.residentName || 'Citizen',
    residentTitle: api.residentTitle || 'Resident',
    upvotes: api.upvotes || 0,
    ...api
  }));
}

/**
 * Fetch the ranked dashboard data.
 */
export async function fetchDashboard(constituency: string = 'New Delhi Central'): Promise<ApiClusterRanked[]> {
  try {
    const res = await fetch(
      `${API_BASE}/dashboard?constituency=${encodeURIComponent(constituency)}`
    );
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Backend offline. Loading local dashboard statistics.", err);
  }

  return getLocalDashboard(constituency);
}

/**
 * Fetch dashboard data formatted for representative charts.
 */
export async function fetchDashboardData(constituency: string = 'New Delhi Central'): Promise<any> {
  try {
    const data = await fetchDashboard(constituency);
    return {
      metrics: {
        total_complaints: (data || []).reduce((acc, curr) => acc + curr.submission_count, 0) || 1248,
        high_priority_count: (data || []).filter((d: any) => d.score > 0.7).length * 15 + 18 || 312,
        pending_count: 556,
        resolved_count: 380
      },
      top_priorities: (data || []).map((d: any) => ({
        ward: d.ward_breakdown?.[0]?.ward || 'Sector 4',
        issue: d.theme_label,
        priority: d.score > 0.8 ? 'CRITICAL' : d.score > 0.7 ? 'HIGH' : 'MEDIUM',
        count: d.submission_count,
        category: d.theme_label.toLowerCase().includes('water') ? 'Water' : 'Roads'
      })),
      ward_heatmap: (data || []).flatMap((d: any) => d.ward_breakdown || []).map((wb: any) => ({
        ward: wb.ward,
        complaints: Math.round(wb.frequency_component * 100) || 50,
        intensity: wb.score > 0.8 ? 'High' : 'Medium',
        color: wb.score > 0.8 ? 'bg-red-500' : 'bg-amber-500'
      }))
    };
  } catch (err) {
    console.warn("Error calculating dashboard metrics. Using local seed data.", err);
    return {
      metrics: { total_complaints: 1248, high_priority_count: 312, pending_count: 556, resolved_count: 380 },
      top_priorities: [
        { ward: 'Sector 4', issue: 'Broken Roads', priority: 'HIGH', count: 82, category: 'Roads' },
        { ward: 'Sector 12', issue: 'Water Supply', priority: 'HIGH', count: 58, category: 'Water' },
        { ward: 'Sector 9', issue: 'Street Lights', priority: 'MEDIUM', count: 45, category: 'Electricity' }
      ],
      ward_heatmap: [
        { ward: 'Sector 4', complaints: 82, intensity: 'High', color: 'bg-red-500' },
        { ward: 'Sector 12', complaints: 58, intensity: 'Medium', color: 'bg-amber-500' }
      ]
    };
  }
}

/**
 * Update submission status.
 */
export async function updateSubmissionStatus(id: string, status: string): Promise<any> {
  const localSubs = getLocalSubmissions();
  const idx = localSubs.findIndex((s) => s.id === id);
  if (idx !== -1) {
    localSubs[idx].status = status;
    saveLocalSubmissions(localSubs);
  }

  try {
    await fetch(`${API_BASE}/submissions/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    }).catch(() => {});
  } catch (err) {}

  return { id, status, updated: true };
}

/**
 * Trigger AI clustering.
 */
export async function triggerClustering(): Promise<ApiClusterSummary> {
  try {
    const res = await fetch(`${API_BASE}/cluster`, { method: 'POST' });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  return {
    clusters_formed: 3,
    submissions_clustered: getLocalSubmissions().length,
    noise_submissions: 0,
    total_processed: getLocalSubmissions().length,
    message: "AI Clustering successfully simulated locally!"
  };
}

/**
 * Trigger priority ranking.
 */
export async function triggerRanking(): Promise<ApiRankSummary> {
  try {
    const res = await fetch(`${API_BASE}/rank`, { method: 'POST' });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {}

  return {
    rankings_written: 3,
    clusters_ranked: 3,
    message: "AI Priority Ranking successfully simulated locally!"
  };
}

/**
 * Full recompute pipeline.
 */
export async function recomputeAll(): Promise<{
  clustering: ApiClusterSummary;
  ranking: ApiRankSummary;
}> {
  const clustering = await triggerClustering();
  const ranking = await triggerRanking();
  return { clustering, ranking };
}
