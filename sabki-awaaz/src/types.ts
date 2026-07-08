// ── Frontend display types ──────────────────────────────────────────────

export interface Submission {
  id: string;
  constituency: string;
  ward: string;
  type: 'text' | 'voice' | 'photo';
  content: string;
  attachmentUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'RESOLVED';
  timestamp: string;
  residentName: string;
  residentTitle: string;
  upvotes: number;
}

export interface WardBadgeData {
  name: string;
  intensity: 'High' | 'Moderate' | 'Low';
  submissions: number;
}

export interface DashboardData {
  metrics: {
    total_complaints: number;
    high_priority_count: number;
    pending_count: number;
    resolved_count: number;
  };
  top_priorities?: any[];
  ward_heatmap?: any[];
}

export interface Theme {
  id: string;
  title: string;
  score: number; // Criticality score out of 100
  tag: string; // e.g., "INFRASTRUCTURE GAP", "URGENT", "HEALTH HAZARD"
  secondaryTag?: string;
  wardBadges: WardBadgeData[];
  submissions: Submission[];
  lastResolution: string;
  legalStanding: string;
  frequency: 'High' | 'Medium' | 'Low';
  budgetAllocation: string;
  averageResponse: string;
  auditStatus: string;
  submissionVolumeWeight: number; // Percentage e.g. 78%
  secondaryWeight: number; // Percentage e.g. 62%
  secondaryWeightLabel: string; // e.g., "POPULATION DENSITY RATIO"
}

export type AppView = 'landing' | 'submit' | 'dashboard' | 'feed' | 'map';

// ── API ↔ Frontend mappers ──────────────────────────────────────────────

import type { ApiClusterRanked, ApiSubmission } from './api';

/**
 * Convert a backend submission into the frontend Submission shape.
 */
export function mapApiSubmission(api: ApiSubmission): Submission {
  return {
    id: api.id.slice(0, 8), // short UUID for display
    constituency: api.constituency,
    ward: api.ward,
    type: api.raw_input_type as 'text' | 'voice' | 'photo',
    content: api.extracted_concern,
    status: 'VERIFIED',
    timestamp: api.submitted_at || new Date().toISOString(),
    residentName: 'Citizen',
    residentTitle: 'Resident',
    upvotes: 0,
  };
}

/**
 * Convert a backend ClusterRanked into the frontend Theme shape.
 * Maps the backend's score (0–1) to a 0–100 display scale.
 */
export function mapApiCluster(api: ApiClusterRanked): Theme {
  const score100 = Math.round(api.score * 100);
  const freq = score100 >= 70 ? 'High' : score100 >= 40 ? 'Medium' : 'Low';

  // Build ward badges from the ward_breakdown
  const wardBadges: WardBadgeData[] = api.ward_breakdown.map((wb) => {
    const intensity: 'High' | 'Moderate' | 'Low' =
      wb.score >= 0.7 ? 'High' : wb.score >= 0.4 ? 'Moderate' : 'Low';
    return {
      name: wb.ward,
      intensity,
      submissions: Math.round(wb.frequency_component * api.submission_count),
    };
  });

  // Build dummy submissions from representative concerns
  const submissions: Submission[] = api.representative_concerns.map(
    (concern, idx) => ({
      id: `${api.cluster_id}-${idx}`,
      constituency: '',
      ward: wardBadges[0]?.name || 'Unknown',
      type: 'text' as const,
      content: concern,
      status: 'VERIFIED' as const,
      timestamp: new Date().toISOString(),
      residentName: 'Citizen',
      residentTitle: 'Resident',
      upvotes: 0,
    })
  );

  // Compute secondary weight from infra component average
  const avgInfra =
    api.ward_breakdown.length > 0
      ? api.ward_breakdown.reduce((sum, wb) => sum + wb.infra_component, 0) /
        api.ward_breakdown.length
      : 0;

  return {
    id: `CLUSTER-${api.cluster_id}`,
    title: api.theme_label,
    score: score100,
    tag: freq === 'High' ? 'URGENT' : freq === 'Medium' ? 'MODERATE' : 'LOW PRIORITY',
    secondaryTag:
      api.submission_count >= 10
        ? 'HIGH VOLUME'
        : api.submission_count >= 5
          ? 'MODERATE VOLUME'
          : undefined,
    wardBadges,
    submissions,
    lastResolution: 'Pending',
    legalStanding: 'Under Review',
    frequency: freq,
    budgetAllocation: freq === 'High' ? 'Tier 1 Priority' : freq === 'Medium' ? 'Tier 2' : 'Tier 3',
    averageResponse: '72 hrs',
    auditStatus: 'Automated Analysis',
    submissionVolumeWeight: Math.min(100, api.submission_count * 5),
    secondaryWeight: Math.round(avgInfra * 100),
    secondaryWeightLabel: 'INFRASTRUCTURE GAP INDEX',
  };
}
