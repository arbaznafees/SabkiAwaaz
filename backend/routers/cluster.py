"""
POST /cluster — trigger clustering of unclustered submissions.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from config import settings
from services.clustering import run_clustering

router = APIRouter()


@router.post("/cluster", response_model=dict)
def trigger_clustering(db: Session = Depends(get_db)):
    """Run HDBSCAN/KMeans clustering on all unclustered submissions."""
    summary = run_clustering(db, settings.DEFAULT_CONSTITUENCY)
    return summary
