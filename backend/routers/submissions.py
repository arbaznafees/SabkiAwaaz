"""
POST /submissions — accept citizen feedback (text / voice / photo).
GET  /submissions — list all submissions for a constituency (debug/demo).
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Submission
from schemas import SubmissionCreate, SubmissionOut
from config import settings
from services import gemini_service

router = APIRouter()


@router.post("/submissions", response_model=dict)
def create_submission(req: SubmissionCreate, db: Session = Depends(get_db)):
    """
    Process a citizen submission:
    1. For voice → transcribe via Gemini
    2. For photo → caption via Gemini
    3. Extract a clean one-sentence concern via Gemini
    4. Generate a 768-dim embedding via Gemini
    5. Persist to DB
    """
    raw_text = None
    transcript = None
    image_caption = None

    if req.type == "text":
        raw_text = req.content
        text_for_extraction = req.content
    elif req.type == "voice":
        transcript = gemini_service.transcribe_audio(req.content)
        text_for_extraction = transcript
    elif req.type == "photo":
        image_caption = gemini_service.caption_image(req.content)
        text_for_extraction = image_caption
    else:
        raise HTTPException(status_code=400, detail=f"Invalid type: {req.type}")

    extracted_concern = gemini_service.extract_concern(text_for_extraction)
    embedding = gemini_service.generate_embedding(extracted_concern)

    submission = Submission(
        raw_input_type=req.type,
        raw_text=raw_text,
        transcript=transcript,
        image_caption=image_caption,
        extracted_concern=extracted_concern,
        ward=req.ward,
        constituency=settings.DEFAULT_CONSTITUENCY,
        embedding=embedding,
        language="hi-en",
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "id": str(submission.id),
        "extracted_concern": submission.extracted_concern,
        "message": "Submission recorded successfully.",
    }


@router.get("/submissions", response_model=list[dict])
def list_submissions(constituency: str, db: Session = Depends(get_db)):
    """Return all submissions for a constituency (for debugging / demo)."""
    rows = (
        db.query(Submission)
        .filter(Submission.constituency == constituency)
        .order_by(Submission.submitted_at.desc())
        .all()
    )
    return [
        {
            "id": str(r.id),
            "raw_input_type": r.raw_input_type,
            "raw_text": r.raw_text,
            "transcript": r.transcript,
            "image_caption": r.image_caption,
            "extracted_concern": r.extracted_concern,
            "ward": r.ward,
            "constituency": r.constituency,
            "submitted_at": r.submitted_at.isoformat() if r.submitted_at else None,
            "cluster_id": r.cluster_id,
            "language": r.language,
        }
        for r in rows
    ]
