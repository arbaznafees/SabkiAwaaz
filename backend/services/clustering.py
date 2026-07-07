"""
Clustering service — groups unclustered submission embeddings using HDBSCAN,
with KMeans fallback if HDBSCAN is not available.
"""

import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import func

from models import Submission, Cluster
from services.gemini_service import generate_theme_label


def run_clustering(db: Session, constituency: str) -> dict:
    """
    Cluster all unclustered submissions for a constituency.
    Returns a summary dict with cluster count and noise count.
    """
    # Fetch unclustered submissions that have embeddings
    submissions = (
        db.query(Submission)
        .filter(
            Submission.constituency == constituency,
            Submission.cluster_id.is_(None),
            Submission.embedding.isnot(None),
        )
        .all()
    )

    if len(submissions) < 2:
        return {
            "clusters_formed": 0,
            "submissions_clustered": 0,
            "noise_submissions": len(submissions),
            "message": "Not enough unclustered submissions to cluster (need >= 2).",
        }

    # Build the embedding matrix
    ids = [s.id for s in submissions]
    embeddings = np.array([s.embedding for s in submissions], dtype=np.float32)

    # ── Try HDBSCAN first, fall back to KMeans ──────────────────────────
    labels = _cluster_hdbscan(embeddings)
    if labels is None:
        labels = _cluster_kmeans(embeddings)

    # ── Assign cluster IDs and create Cluster rows ──────────────────────
    # Find the current max cluster id so we don't collide
    max_existing = db.query(func.max(Cluster.id)).scalar() or 0

    unique_labels = set(labels)
    unique_labels.discard(-1)  # -1 = noise in HDBSCAN

    label_to_cluster_id = {}
    clusters_formed = 0

    for label in sorted(unique_labels):
        cluster_id = max_existing + label + 1
        # Gather indices for this cluster
        member_indices = [i for i, l in enumerate(labels) if l == label]
        member_submissions = [submissions[i] for i in member_indices]

        # Pick up to 5 samples for theme labeling
        sample_concerns = [s.extracted_concern for s in member_submissions[:5]]
        theme_label = generate_theme_label(sample_concerns)

        cluster_row = Cluster(
            id=cluster_id,
            theme_label=theme_label,
            submission_count=len(member_submissions),
            constituency=constituency,
        )
        db.merge(cluster_row)  # merge in case id already exists
        label_to_cluster_id[label] = cluster_id
        clusters_formed += 1

    # Assign cluster_id to each submission
    noise_count = 0
    clustered_count = 0
    for i, label in enumerate(labels):
        if label == -1:
            noise_count += 1
            continue
        submissions[i].cluster_id = label_to_cluster_id[label]
        clustered_count += 1

    db.commit()

    summary = {
        "clusters_formed": clusters_formed,
        "submissions_clustered": clustered_count,
        "noise_submissions": noise_count,
        "total_processed": len(submissions),
    }
    print(f"📊 Clustering summary: {summary}")
    return summary


def _cluster_hdbscan(embeddings: np.ndarray):
    """Try HDBSCAN clustering. Returns labels array or None if unavailable."""
    try:
        import hdbscan
    except ImportError:
        print("⚠️  hdbscan package not available, falling back to KMeans.")
        return None

    # min_cluster_size=2: tuned for demo-scale data (~70 submissions).
    # For production volumes (thousands+), increase to 5-10 to avoid
    # over-fragmentation and reduce noise sensitivity.
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=2,
        min_samples=1,
        metric="euclidean",
    )
    labels = clusterer.fit_predict(embeddings)
    return labels.tolist()


def _cluster_kmeans(embeddings: np.ndarray):
    """KMeans fallback — pick k via silhouette score (range 3-10)."""
    from sklearn.cluster import KMeans
    from sklearn.metrics import silhouette_score

    best_k = 5  # sensible default
    best_score = -1

    k_range = range(3, min(11, len(embeddings)))
    for k in k_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        trial_labels = km.fit_predict(embeddings)
        score = silhouette_score(embeddings, trial_labels)
        if score > best_score:
            best_score = score
            best_k = k

    km = KMeans(n_clusters=best_k, random_state=42, n_init=10)
    labels = km.fit_predict(embeddings)
    print(f"📊 KMeans chose k={best_k} (silhouette={best_score:.3f})")
    return labels.tolist()
