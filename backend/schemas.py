"""
Pydantic request / response schemas for API validation.
"""

from pydantic import BaseModel
from typing import Optional


# ── Submission ──────────────────────────────────────────────────────────

class SubmissionCreate(BaseModel):
    type: str  # "text" | "voice" | "photo"
    content: str  # raw text, base64 audio, or base64 image
    ward: str


class SubmissionOut(BaseModel):
    id: str
    raw_input_type: str
    raw_text: Optional[str] = None
    transcript: Optional[str] = None
    image_caption: Optional[str] = None
    extracted_concern: str
    ward: str
    constituency: str
    submitted_at: str
    cluster_id: Optional[int] = None
    language: Optional[str] = None


# ── Dashboard ───────────────────────────────────────────────────────────

class WardBreakdown(BaseModel):
    ward: str
    score: float
    frequency_component: float
    population_component: float
    infra_component: float


class ClusterRanked(BaseModel):
    cluster_id: int
    theme_label: str
    score: float
    submission_count: int
    representative_concerns: list[str]
    ward_breakdown: list[WardBreakdown]


# ── Generic ─────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
    detail: Optional[str] = None
