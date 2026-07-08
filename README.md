# 🇮🇳 SabkiAwaaz

**AI-Powered Citizen Grievance Analysis & Constituency Intelligence Platform**

*Empowering Citizens. Understanding Public Concerns. Enabling Data-Driven Governance.*

---

## 🔗 Live Production Deployments

- **Frontend Web Application:** https://sabki-awaaz.vercel.app/
- **Backend REST API Platform:** https://sabkiawaaz.onrender.com/
- **Interactive API Documentation:** https://sabkiawaaz.onrender.com/docs

---

# 📖 Introduction

An average Lok Sabha constituency in India represents **15–25 lakh citizens**. Public feedback streams in through multiple fragmented channels—letters, community meetings, social media, and direct grievances—with no unified mechanism to identify recurring patterns or prioritize development initiatives based on evidence.

**SabkiAwaaz** is an AI-powered platform that transforms scattered, unstructured citizen feedback into a structured, ranked development roadmap for Members of Parliament (MPs). Citizens can report civic issues using **voice, text, or images** in their preferred language, while an AI-driven backend extracts the underlying concern, generates semantic embeddings, clusters similar issues, and ranks them using demographic and public infrastructure datasets.

---

# 🧩 Problem Statement

| Challenge | Impact |
|------------|--------|
| 📢 Unstructured Citizen Feedback | Large volumes of complaints across multiple channels are difficult to analyze manually. |
| 🔁 Duplicate Complaints | Similar issues are reported using different wording without consolidation. |
| 📊 Poor Priority Identification | Representatives struggle to identify genuinely urgent issues. |
| 🗺️ Limited Constituency Insights | Raw complaints do not provide meaningful ward-level intelligence. |
| 🌐 Accessibility Barriers | Text-only portals exclude citizens with literacy or language barriers. |
| 📈 Lack of Data-Driven Governance | Development decisions often rely on intuition rather than evidence. |

---

# 💡 Solution Architecture

## 1. Multichannel Multimodal Intake

Citizens submit grievances through:

- 📝 Text
- 🎤 Voice Notes
- 📷 Images

Supported languages include:

- English
- Hindi
- Hinglish

---

## 2. AI Core Extraction

Google Gemini performs:

- Speech-to-text transcription
- Image captioning
- Core concern extraction

Every submission is converted into one clean, standardized grievance statement.

---

## 3. Semantic Vector Embeddings

The extracted concern is converted into a **768-dimensional embedding** using Gemini Embedding Models and stored inside PostgreSQL using the **pgvector** extension.

---

## 4. Intelligent Issue Clustering

HDBSCAN automatically groups semantically similar grievances into large civic issue themes.

Example:

- Road full of potholes
- Broken roads in Sector 12
- सड़क बहुत खराब है

↓

Single Cluster:

> Road Infrastructure Problems

---

## 5. Data-Driven Priority Ranking

Instead of ranking by complaint count alone, SabkiAwaaz computes:

```text
Score =
w₁ × Frequency
+ w₂ × Population Affected
+ w₃ × Infrastructure Gap
```

This combines:

- Citizen submissions
- Census statistics
- Ward demographics
- data.gov.in datasets

to prioritize development work objectively.

---

## 6. Interactive MP Dashboard

The dashboard provides:

- Ward-wise issue heatmaps
- Ranked issue clusters
- Supporting citizen evidence
- Infrastructure statistics
- Development recommendations

---

# 🏗️ System Architecture

```text
Citizen
   │
   ▼
Voice / Text / Image
   │
   ▼
Google Gemini
(Core Concern Extraction)
   │
   ▼
Gemini Embeddings
   │
   ▼
PostgreSQL + pgvector
   │
   ▼
HDBSCAN Clustering
   │
   ▼
Priority Ranking Engine
(Frequency + Demographics + Infrastructure)
   │
   ▼
Representative Dashboard
```

---

# 🛠️ Tech Stack

## Frontend

- React 19
- TypeScript
- Vite 6
- Tailwind CSS 4
- Motion
- Lucide React
- Axios

Deployment:

- Vercel

---

## Backend

- Python
- FastAPI
- Uvicorn
- SQLAlchemy

AI

- Google Gemini API
- google-genai SDK

Machine Learning

- HDBSCAN
- Scikit-learn
- NumPy

Deployment

- Render

---

## Database

- PostgreSQL
- pgvector
- Neon Database

---

# 📁 Project Structure

```text
SabkiAwaaz/
│
├── backend/
│   ├── routers/
│   │   ├── cluster.py
│   │   ├── dashboard.py
│   │   ├── rank.py
│   │   └── submissions.py
│   │
│   ├── services/
│   │   ├── clustering.py
│   │   ├── gemini_service.py
│   │   └── ranking.py
│   │
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── sabki-awaaz/
│   ├── src/
│   │   ├── components/
│   │   ├── locales/
│   │   ├── pages/
│   │   ├── api.ts
│   │   └── App.tsx
│   │
│   └── package.json
│
└── docker-compose.yml
```

---

# 🔌 REST API

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/` | API status |
| POST | `/api/submissions` | Submit grievance |
| GET | `/api/submissions` | List grievances |
| POST | `/api/cluster` | Run semantic clustering |
| POST | `/api/rank` | Generate ranked priorities |
| GET | `/api/dashboard` | Dashboard analytics |

---

# 🚀 Local Installation

## Prerequisites

Install:

- Node.js
- npm
- Python 3.10+
- Docker
- Docker Compose
- Google Gemini API Key

---

## 1. Clone Repository

```bash
git clone <repository-url>
cd SabkiAwaaz
```

---

## 2. Start PostgreSQL + pgvector

```bash
docker compose up -d
```

---

## 3. Backend Setup

```bash
cd backend

pip install -r requirements.txt
```

Create:

`.env`

```env
GEMINI_API_KEY=your_api_key

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sabkiawaaz

FRONTEND_URL=http://localhost:3000

DEFAULT_CONSTITUENCY=New Delhi Central
```

Run:

```bash
uvicorn main:app --reload
```

---

## 4. Frontend Setup

```bash
cd sabki-awaaz

npm install
```

Create:

`.env`

```env
VITE_API_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

# 📊 Key Features

- 🎤 Voice-based grievance submission
- 📝 Text grievance submission
- 📷 Image grievance submission
- 🌐 Hindi, English & Hinglish support
- 🤖 AI-powered issue understanding
- 🔍 Semantic search using vector embeddings
- 🧠 Automatic issue clustering
- 📈 Demographic-aware issue prioritization
- 🗺️ Constituency analytics dashboard
- 📊 Ward-level development insights

---

# 🌟 Future Enhancements

- WhatsApp Integration
- IVR-based Complaint Registration
- GIS Heatmaps
- MLA Dashboard
- Real-time Analytics
- Complaint Tracking
- SMS Notifications

---

# 👨‍💻 Developed For

AI-powered governance, constituency intelligence, and citizen grievance analytics.

**Empowering Citizens. Enabling Evidence-Based Governance. 🇮🇳**
