"""
GET /dashboard — returns ranked clusters with theme info, scores,
representative citizen quotes, and per-ward breakdowns.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Cluster, Ranking, Submission

router = APIRouter()


@router.get("/dashboard", response_model=list[dict])
def get_dashboard(constituency: str, db: Session = Depends(get_db)):
    """
    Return ranked clusters for a constituency. Each cluster includes:
    - theme_label, overall score, submission_count
    - Top 3 representative extracted_concern text snippets
    - Per-ward breakdown with component scores
    """
    clusters = (
        db.query(Cluster)
        .filter(Cluster.constituency == constituency)
        .all()
    )

    result = []
    for cluster in clusters:
        # Per-ward rankings for this cluster
        rankings = (
            db.query(Ranking)
            .filter(Ranking.cluster_id == cluster.id)
            .all()
        )

        # Top 3 representative submissions (by earliest submitted)
        rep_submissions = (
            db.query(Submission)
            .filter(Submission.cluster_id == cluster.id)
            .order_by(Submission.submitted_at)
            .limit(3)
            .all()
        )

        # Overall cluster score = average of per-ward scores
        if rankings:
            overall_score = sum(r.score for r in rankings) / len(rankings)
        else:
            overall_score = 0.0

        ward_breakdown = [
            {
                "ward": r.ward,
                "score": round(r.score, 3),
                "frequency_component": round(r.frequency_component, 3),
                "population_component": round(r.population_component, 3),
                "infra_component": round(r.infra_component, 3),
            }
            for r in rankings
        ]

        result.append({
            "cluster_id": cluster.id,
            "theme_label": cluster.theme_label,
            "score": round(overall_score, 3),
            "submission_count": cluster.submission_count,
            "representative_concerns": [
                s.extracted_concern for s in rep_submissions
            ],
            "ward_breakdown": ward_breakdown,
        })

    # Sort by score descending
    result.sort(key=lambda x: x["score"], reverse=True)
    return result
