"""
SabkiAwaaz — FastAPI application entry point.

Provides the REST API for citizen submissions, clustering, ranking,
and the MP dashboard.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from database import init_db
from routers import submissions, cluster, rank, dashboard


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize DB tables on startup."""
    init_db()
    yield


app = FastAPI(
    title="SabkiAwaaz API",
    description="AI-powered constituency feedback analysis for Members of Parliament",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers under /api prefix
app.include_router(submissions.router, prefix="/api", tags=["Submissions"])
app.include_router(cluster.router, prefix="/api", tags=["Clustering"])
app.include_router(rank.router, prefix="/api", tags=["Ranking"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard"])


@app.get("/")
def root():
    return {
        "app": "SabkiAwaaz API",
        "status": "running",
        "docs": "/docs",
    }
