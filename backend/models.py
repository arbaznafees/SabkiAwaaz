"""
SQLAlchemy ORM models matching the database schema.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Text, Integer, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector

from database import Base


class Submission(Base):
    __tablename__ = "submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    raw_input_type = Column(String(10), nullable=False)  # text | voice | photo
    raw_text = Column(Text, nullable=True)
    transcript = Column(Text, nullable=True)
    image_caption = Column(Text, nullable=True)
    extracted_concern = Column(Text, nullable=False)
    ward = Column(String(100), nullable=False)
    constituency = Column(String(100), nullable=False)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    embedding = Column(Vector(768))  # Gemini text-embedding-004 dimension
    cluster_id = Column(Integer, nullable=True)
    language = Column(String(20), nullable=True)


class Cluster(Base):
    __tablename__ = "clusters"

    id = Column(Integer, primary_key=True, autoincrement=True)
    theme_label = Column(Text, nullable=False)
    submission_count = Column(Integer, nullable=False, default=0)
    constituency = Column(String(100), nullable=False)


class DemandData(Base):
    __tablename__ = "demand_data"

    ward = Column(String(100), primary_key=True)
    population = Column(Integer, nullable=False)
    school_enrollment = Column(Integer, nullable=True)
    infra_gap_score = Column(Float, nullable=True)
    source = Column(String(200), nullable=True)


class Ranking(Base):
    __tablename__ = "rankings"

    cluster_id = Column(Integer, primary_key=True)
    ward = Column(String(100), primary_key=True)
    score = Column(Float, nullable=False)
    frequency_component = Column(Float, nullable=False)
    population_component = Column(Float, nullable=False)
    infra_component = Column(Float, nullable=False)
    computed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
