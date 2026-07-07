"""
Ranking service — computes priority scores for each (cluster, ward) pair.

Score formula:  0.40 * frequency  +  0.35 * population  +  0.25 * infra_gap
All components are min-max normalized to [0, 1] before weighting.
"""

from datetime import datetime, timezone

import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import func

from models import Submission, Cluster, DemandData, Ranking


def compute_rankings(db: Session, constituency: str) -> dict:
    """
    Compute and persist rankings for all clusters in a constituency.
    Returns a summary of how many ranking rows were written.
    """
    # ── Gather raw data ─────────────────────────────────────────────────

    # Submission counts per (cluster_id, ward)
    freq_rows = (
        db.query(
            Submission.cluster_id,
            Submission.ward,
            func.count(Submission.id).label("cnt"),
        )
        .filter(
            Submission.constituency == constituency,
            Submission.cluster_id.isnot(None),
        )
        .group_by(Submission.cluster_id, Submission.ward)
        .all()
    )

    if not freq_rows:
        return {"rankings_written": 0, "clusters_ranked": 0, "message": "No clustered submissions found."}

    # Demand data keyed by ward
    demand_rows = db.query(DemandData).all()
    demand_by_ward = {d.ward: d for d in demand_rows}

    # ── Build raw component arrays ──────────────────────────────────────

    entries = []
    for cluster_id, ward, cnt in freq_rows:
        demand = demand_by_ward.get(ward)
        entries.append({
            "cluster_id": cluster_id,
            "ward": ward,
            "frequency": cnt,
            "population": demand.population if demand else 0,
            "infra_gap": demand.infra_gap_score if demand and demand.infra_gap_score else 0,
        })

    # ── Normalize 0-1 (min-max) ─────────────────────────────────────────

    freqs = np.array([e["frequency"] for e in entries], dtype=float)
    pops = np.array([e["population"] for e in entries], dtype=float)
    infras = np.array([e["infra_gap"] for e in entries], dtype=float)

    def _normalize(arr: np.ndarray) -> np.ndarray:
        mn, mx = arr.min(), arr.max()
        if mx == mn:
            return np.ones_like(arr)  # all equal → treat as 1.0
        return (arr - mn) / (mx - mn)

    freq_norm = _normalize(freqs)
    pop_norm = _normalize(pops)
    infra_norm = _normalize(infras)

    # ── Compute weighted score and persist ──────────────────────────────

    now = datetime.now(timezone.utc)

    # Clear old rankings for this constituency's clusters
    cluster_ids = list({e["cluster_id"] for e in entries})
    db.query(Ranking).filter(Ranking.cluster_id.in_(cluster_ids)).delete(
        synchronize_session=False
    )

    for i, e in enumerate(entries):
        score = 0.40 * freq_norm[i] + 0.35 * pop_norm[i] + 0.25 * infra_norm[i]
        ranking = Ranking(
            cluster_id=e["cluster_id"],
            ward=e["ward"],
            score=float(score),
            frequency_component=float(freq_norm[i]),
            population_component=float(pop_norm[i]),
            infra_component=float(infra_norm[i]),
            computed_at=now,
        )
        db.merge(ranking)

    # Also update submission_count on each cluster
    for cid in cluster_ids:
        total = (
            db.query(func.count(Submission.id))
            .filter(Submission.cluster_id == cid)
            .scalar()
        )
        db.query(Cluster).filter(Cluster.id == cid).update(
            {"submission_count": total}
        )

    db.commit()

    return {"rankings_written": len(entries), "clusters_ranked": len(cluster_ids)}
