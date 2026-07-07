"""
POST /rank — compute priority rankings for all clusters.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from config import settings
from services.ranking import compute_rankings

router = APIRouter()


@router.post("/rank", response_model=dict)
def trigger_ranking(db: Session = Depends(get_db)):
    """Compute weighted priority scores for every (cluster, ward) pair."""
    summary = compute_rankings(db, settings.DEFAULT_CONSTITUENCY)
    return summary
