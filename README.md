# Sabki Awaaz — AI-Powered Constituency Feedback Platform

> "Har Awaaz Suniye. Har Samasya Samjhiye."

Sabki Awaaz connects the sovereign voice of local citizens with direct legislative intervention. Citizens submit grievances (text, voice, or photos), and the platform uses **Gemini AI** to automatically extract concerns, cluster them into themes, and rank them by urgency for Members of Parliament.

---

## Architecture

```
SabkiAwaaz/
├── backend/          # FastAPI + PostgreSQL + Gemini AI
│   ├── main.py       # App entry point (routes under /api)
│   ├── models.py     # SQLAlchemy ORM models
│   ├── schemas.py    # Pydantic request/response schemas
│   ├── routers/      # API route handlers
│   │   ├── submissions.py   # POST/GET /api/submissions
│   │   ├── cluster.py       # POST /api/cluster
│   │   ├── rank.py          # POST /api/rank
│   │   └── dashboard.py     # GET /api/dashboard
│   └── services/     # Business logic
│       ├── gemini_service.py  # Gemini AI (transcription, captioning, embeddings)
│       ├── clustering.py      # HDBSCAN/KMeans clustering
│       └── ranking.py         # Weighted priority scoring
│
├── sabki-awaaz/      # Vite + React + TailwindCSS frontend
│   ├── src/
│   │   ├── App.tsx           # Main application (routes & views)
│   │   ├── api.ts            # Backend API service layer
│   │   ├── types.ts          # TypeScript types + API mappers
│   │   ├── constants.ts      # Constituencies, maps, wards
│   │   └── components/       # React components
│   │       ├── SubmitForm.tsx # Citizen submission form
│   │       ├── ThemeCard.tsx  # Dashboard theme dossier card
│   │       └── WardBadge.tsx  # Ward intensity badge
│   └── vite.config.ts        # Vite config with /api proxy
│
└── frontend/         # (Deprecated) Old Next.js frontend
```

---

## Prerequisites

- **Node.js** 18+
- **Python** 3.10+
- **PostgreSQL** 14+ with **pgvector** extension
- **Gemini API Key** (Google AI)

---

## Quick Start

### 1. Database Setup

```bash
# Create the PostgreSQL database
createdb sabkiawaaz

# Enable pgvector extension (done automatically on app startup)
psql sabkiawaaz -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 2. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env with your GEMINI_API_KEY and DATABASE_URL

# Run the server
uvicorn main:app --reload
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 3. Frontend

```bash
cd sabki-awaaz

# Install dependencies
npm install

# Run dev server
npm run dev
# App available at http://localhost:3000
# API calls are proxied to http://localhost:8000
```

### 4. Seed Data (Optional)

```bash
cd backend
python seed.py
# Seeds sample submissions, runs clustering, and computes rankings
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/submissions` | Submit a citizen grievance (text/voice/photo) |
| `GET` | `/api/submissions?constituency=X` | List all submissions for a constituency |
| `POST` | `/api/cluster` | Trigger AI clustering of submissions |
| `POST` | `/api/rank` | Compute priority rankings |
| `GET` | `/api/dashboard?constituency=X` | Get ranked theme dossiers |

---

## Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS 4, Lucide Icons
- **Backend**: FastAPI, SQLAlchemy, Pydantic
- **AI**: Google Gemini (text extraction, audio transcription, image captioning, embeddings)
- **Database**: PostgreSQL with pgvector for semantic similarity
- **ML**: HDBSCAN/KMeans clustering, weighted priority scoring
