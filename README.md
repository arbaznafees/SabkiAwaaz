# 🇮🇳 SabkiAwaaz

**AI-Powered Citizen Grievance Analysis & Constituency Intelligence Platform**

*Empowering Citizens. Understanding Public Concerns. Enabling Data-Driven Governance.*

---

## 📖 Introduction

SabkiAwaaz is an AI-powered citizen grievance and constituency feedback analysis platform designed to bridge the communication gap between citizens and their elected representatives.

Citizens frequently face civic problems such as damaged roads, waterlogging, waste management issues, infrastructure shortages, and other public concerns. Although citizens may report these issues, large volumes of unstructured feedback make it difficult for representatives and authorities to identify recurring problems, understand public priorities, and decide which issues require immediate attention.

SabkiAwaaz provides a structured digital platform where citizens can submit grievances while an AI-powered backend processes public feedback, extracts concerns, generates semantic embeddings, groups similar complaints into meaningful clusters, and ranks public issues using constituency-level demand data.

The platform combines a modern bilingual citizen interface with artificial intelligence, machine learning, vector search capabilities, and data-driven dashboards to transform individual grievances into actionable constituency intelligence.

---

## 🧩 Problem Statement

Traditional citizen grievance systems face several challenges that limit effective communication between citizens and public representatives.

| Challenge | Impact |
|---|---|
| 📢 Unstructured Citizen Feedback | Large volumes of complaints are difficult to manually analyze and organize. |
| 🔁 Repeated Complaints | Similar civic issues may be reported multiple times without being grouped together. |
| 📊 Lack of Priority Identification | Representatives may find it difficult to determine which issues require urgent attention. |
| 🗺️ Limited Constituency Insights | Raw grievances do not provide meaningful ward-level or constituency-level intelligence. |
| 🌐 Accessibility Barriers | Citizens need simple and accessible digital platforms for communicating public concerns. |
| 📈 Lack of Data-Driven Decision Making | Public representatives need structured insights instead of manually reviewing individual complaints. |

---

## 💡 Solution

SabkiAwaaz transforms citizen feedback into structured and actionable public intelligence through an end-to-end grievance analysis workflow.

- 📝 **Digital Grievance Submission** — Citizens can submit civic concerns through a dedicated grievance interface.
- 🤖 **AI-Powered Concern Extraction** — Google Gemini processes submitted feedback and extracts meaningful public concerns.
- 🧠 **Semantic Embeddings** — Citizen grievances are converted into vector embeddings for intelligent similarity analysis.
- 🔗 **Automated Issue Clustering** — HDBSCAN groups semantically similar grievances into meaningful issue clusters.
- 📊 **Data-Driven Issue Ranking** — Public issues are ranked using frequency, population, and infrastructure-related components.
- 🏛️ **Representative Dashboard** — Public representatives can explore organized constituency concerns through a dedicated dashboard.
- 👤 **Citizen Dashboard** — Citizens receive a dedicated interface for interacting with the grievance ecosystem.
- 🔍 **Complaint Tracking** — A dedicated interface enables citizens to track their submitted complaints.
- 🌐 **Bilingual Interface** — The frontend includes English and Hindi localization support.

---

## ✨ Key Features

### 1. 📝 Citizen Grievance Submission

SabkiAwaaz provides a dedicated grievance submission workflow through which citizens can communicate civic concerns.

The backend submission model supports multiple input categories:

- Text
- Voice
- Photo

The platform stores structured information related to each submission, including the extracted concern, ward, constituency, submission time, language, embeddings, and cluster information.

### 2. 🤖 Gemini-Powered AI Processing

The backend integrates with the Google Gemini API to provide artificial intelligence capabilities.

Gemini is used as part of the grievance intelligence pipeline to process citizen feedback and generate structured information that can later be analyzed by the platform.

The AI service is also integrated with semantic embedding generation, enabling the system to represent citizen concerns as high-dimensional vectors.

### 3. 🧠 Semantic Vector Embeddings

Citizen concerns are converted into vector representations using Gemini embeddings.

These embeddings are stored directly inside PostgreSQL using the `pgvector` extension.

Vector-based representations allow the application to analyze semantic similarity between citizen grievances rather than relying exclusively on exact keyword matching.

### 4. 🔗 Intelligent Issue Clustering

SabkiAwaaz uses the HDBSCAN clustering algorithm to automatically identify groups of related citizen concerns.

Instead of requiring administrators or representatives to manually review every complaint, the clustering pipeline can organize similar public concerns into issue themes.

Each cluster contains information including:

- Theme label
- Submission count
- Constituency

This transforms large volumes of individual citizen feedback into structured public issue categories.

### 5. 📊 Data-Driven Issue Ranking

The platform contains a ranking system designed to prioritize public concerns.

Issue ranking considers multiple components:

- Complaint frequency
- Population data
- Infrastructure gap information

The resulting ranking scores help convert public feedback into structured priority information that can support constituency-level decision making.

### 6. 🏛️ Representative Dashboard

SabkiAwaaz provides a dedicated interface for representatives to explore constituency-level grievance intelligence.

The dashboard connects with the backend API to retrieve structured grievance and ranking information.

This allows representatives to understand public concerns through organized data instead of manually reviewing every citizen submission.

### 7. 👤 Citizen Dashboard

The application includes a dedicated Citizen Dashboard designed to provide citizens with a centralized interface for interacting with the platform.

Citizens can access grievance-related functionality through the platform's modern web interface.

### 8. 🔍 Complaint Tracking

SabkiAwaaz includes a dedicated complaint tracking page.

The tracking interface is designed to improve transparency by providing citizens with a structured location for checking grievance-related information.

### 9. 🌐 English & Hindi Localization

The frontend includes a localization system with translation resources.

This enables SabkiAwaaz to provide a more accessible experience for users through English and Hindi interface support.

The bilingual approach is particularly important for citizen-focused digital governance platforms.

### 10. 🏛️ Government-Inspired Responsive Interface

The frontend follows a government portal-inspired visual design.

The application includes reusable interface components such as:

- Government top bar
- Navigation bar
- Brand identity components
- Footer
- Grievance submission forms
- Theme cards
- Ward badges

The platform uses React, Tailwind CSS, and Motion to create a modern and interactive user experience.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         CITIZENS                              │
│                                                                │
│           Submit · Track · Explore Public Services            │
└──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND APPLICATION                       │
│                                                                │
│             React 19 · TypeScript · Vite 6                    │
│              Tailwind CSS 4 · Motion                           │
│                                                                │
│   ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐   │
│   │ Landing Page │ │ Citizen      │ │ Submit Grievance   │   │
│   │              │ │ Dashboard    │ │                    │   │
│   └──────────────┘ └──────────────┘ └────────────────────┘   │
│                                                                │
│   ┌──────────────┐ ┌──────────────────────────────────────┐  │
│   │ Track        │ │ Representative Dashboard             │  │
│   │ Complaint    │ │                                       │  │
│   └──────────────┘ └──────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────┘
                                │
                                │ REST API
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                         BACKEND                                │
│                                                                │
│                    Python · FastAPI                            │
│                                                                │
│   ┌────────────────┐ ┌─────────────┐ ┌───────────────────┐   │
│   │ Submission API │ │ Clustering  │ │ Ranking Engine    │   │
│   │                │ │ Service     │ │                    │   │
│   └────────────────┘ └─────────────┘ └───────────────────┘   │
│                                                                │
│   ┌──────────────────────┐ ┌──────────────────────────────┐  │
│   │ Dashboard API        │ │ Gemini AI Service             │  │
│   │                      │ │                                │  │
│   └──────────────────────┘ └──────────────────────────────┘  │
└──────────────┬───────────────────────────────┬───────────────┘
               │                               │
               ▼                               ▼
┌────────────────────────────┐    ┌────────────────────────────┐
│        GOOGLE GEMINI        │    │       MACHINE LEARNING     │
│                              │    │                             │
│ AI Processing                │    │ HDBSCAN Clustering          │
│ Semantic Embeddings          │    │ Scikit-learn                │
└────────────────────────────┘    └────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────────────────┐
│                         DATABASE                               │
│                                                                │
│                   PostgreSQL + pgvector                        │
│                                                                │
│   Submissions · Clusters · Demand Data · Rankings              │
│                    Vector Embeddings                            │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚙️ How It Works

| Step | Process | Description |
|---|---|---|
| 1 | Citizen Interaction | A citizen accesses the SabkiAwaaz web application. |
| 2 | Grievance Submission | The citizen submits a public concern through the grievance interface. |
| 3 | Backend Processing | The React frontend communicates with the FastAPI backend through REST APIs. |
| 4 | AI Analysis | Gemini processes the citizen feedback and supports structured concern extraction. |
| 5 | Embedding Generation | The grievance is converted into a semantic vector embedding. |
| 6 | Data Storage | Submission information and vector embeddings are stored in PostgreSQL with pgvector. |
| 7 | Issue Clustering | HDBSCAN analyzes semantic similarities and groups related complaints. |
| 8 | Theme Generation | Related submissions are organized into structured public concern clusters. |
| 9 | Priority Ranking | The ranking engine calculates scores using frequency, population, and infrastructure components. |
| 10 | Dashboard Insights | Structured grievance intelligence becomes available through dashboard APIs. |
| 11 | Representative Analysis | Representatives can explore organized constituency concerns and priorities. |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 | Component-based frontend user interface |
| TypeScript | Type-safe frontend development |
| Vite 6 | Development server and production build system |
| Tailwind CSS 4 | Utility-first interface styling |
| Motion | Animations and interactive transitions |
| Lucide React | Modern interface icons |

### Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | High-performance REST API framework |
| Uvicorn | ASGI application server |
| SQLAlchemy | Object Relational Mapping and database operations |
| Pydantic Settings | Environment-based application configuration |
| Python Multipart | Multipart request processing |

### AI & Machine Learning

| Technology | Purpose |
|---|---|
| Google Gemini | AI-powered grievance processing and embeddings |
| HDBSCAN | Semantic grievance clustering |
| Scikit-learn | Machine learning utilities |
| NumPy | Numerical computation |

### Database

| Technology | Purpose |
|---|---|
| PostgreSQL | Relational application database |
| pgvector | Vector embedding storage and operations |
| Psycopg2 | PostgreSQL database adapter |

### Infrastructure & Development

| Technology | Purpose |
|---|---|
| Docker | Containerization support |
| Docker Compose | PostgreSQL and pgvector database setup |
| Git | Version control |
| npm | Frontend package management |

---

## 🖥️ Installation & Setup

### Prerequisites

Before running SabkiAwaaz locally, install:

- Node.js
- npm
- Python
- pip
- Git
- Docker and Docker Compose
- Google Gemini API key

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd SabkiAwaaz
```

### 2️⃣ Start PostgreSQL with pgvector

The project includes a Docker Compose configuration for PostgreSQL with pgvector.

Run:

```bash
docker compose up -d
```

The database service will be available on:

```
localhost:5432
```

### 3️⃣ Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory:

```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sabkiawaaz
FRONTEND_URL=http://localhost:3000
DEFAULT_CONSTITUENCY=New Delhi Central
```

Start the FastAPI development server:

```bash
uvicorn main:app --reload
```

The backend API will be available at:

```
http://localhost:8000
```

FastAPI interactive documentation will be available at:

```
http://localhost:8000/docs
```

### 4️⃣ Configure the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd sabki-awaaz
```

Install frontend dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend development server:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

### 5️⃣ Build for Production

To create a production frontend build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## 🔐 Environment Variables

### Backend

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | API key used for Google Gemini integration | Yes |
| `DATABASE_URL` | PostgreSQL database connection string | No — default provided |
| `FRONTEND_URL` | Allowed frontend origin for CORS | No — defaults to localhost |
| `DEFAULT_CONSTITUENCY` | Default constituency used by backend services | No — default provided |

### Frontend

| Variable | Description | Required |
|---|---|---|
| `VITE_API_URL` | Base URL of the FastAPI backend | Yes |

---

## 📁 Project Structure

```
SabkiAwaaz/
│
├── backend/                         # FastAPI backend application
│   │
│   ├── routers/                     # REST API route definitions
│   │   ├── cluster.py               # Grievance clustering endpoint
│   │   ├── dashboard.py             # Dashboard data endpoint
│   │   ├── rank.py                  # Issue ranking endpoint
│   │   ├── submissions.py           # Grievance submission endpoints
│   │   └── __init__.py
│   │
│   ├── services/                    # Application business logic
│   │   ├── clustering.py            # HDBSCAN clustering service
│   │   ├── gemini_service.py        # Google Gemini integration
│   │   ├── ranking.py               # Public issue ranking engine
│   │   └── __init__.py
│   │
│   ├── config.py                    # Environment configuration
│   ├── database.py                  # SQLAlchemy database setup
│   ├── main.py                      # FastAPI application entry point
│   ├── models.py                    # SQLAlchemy database models
│   ├── schemas.py                   # API request and response schemas
│   ├── seed.py                      # Database seed functionality
│   ├── requirements.txt             # Python dependencies
│   └── Dockerfile                   # Backend container configuration
│
├── sabki-awaaz/                     # React frontend application
│   │
│   ├── src/
│   │   │
│   │   ├── components/              # Reusable UI components
│   │   │   ├── BrandLogo.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── GovernmentTopBar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── SubmitForm.tsx
│   │   │   ├── ThemeCard.tsx
│   │   │   └── WardBadge.tsx
│   │   │
│   │   ├── locales/
│   │   │   └── translations.ts      # English and Hindi translations
│   │   │
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx
│   │   │   ├── AuxiliaryPages.tsx
│   │   │   ├── CitizenDashboardPage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── RepresentativeDashboardPage.tsx
│   │   │   ├── SubmitGrievancePage.tsx
│   │   │   └── TrackComplaintPage.tsx
│   │   │
│   │   ├── api.ts                   # Backend API communication
│   │   ├── App.tsx                  # Application routing and root component
│   │   ├── constants.ts             # Frontend application constants
│   │   ├── index.css                # Application styles
│   │   ├── main.tsx                 # React application entry point
│   │   └── types.ts                 # TypeScript definitions
│   │
│   ├── .env.example                 # Frontend environment example
│   ├── package.json                 # Frontend dependencies and scripts
│   └── package-lock.json
│
├── docker-compose.yml               # PostgreSQL + pgvector service
├── .gitignore                       # Git ignored files
└── README.md                        # Project documentation
```

---

## 🔌 API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status and access documentation information |
| POST | `/api/submissions` | Submit a new citizen grievance |
| GET | `/api/submissions` | Retrieve citizen grievance submissions |
| POST | `/api/cluster` | Run the grievance clustering pipeline |
| POST | `/api/rank` | Calculate public issue rankings |
| GET | `/api/dashboard` | Retrieve structured dashboard information |

FastAPI automatically provides interactive API documentation at:

```
/docs
```

---

## 🗄️ Database Models

The backend contains four primary database models.

| Model | Purpose |
|---|---|
| `Submission` | Stores citizen grievances, extracted concerns, embeddings, location, language, and cluster information |
| `Cluster` | Stores identified grievance themes and submission counts |
| `DemandData` | Stores ward population, school enrollment, infrastructure gap scores, and data sources |
| `Ranking` | Stores calculated issue priority scores and ranking components |

---

## 📸 Application Screens

| Screen | Purpose |
|---|---|
| Landing Page | Introduces citizens to the SabkiAwaaz platform |
| Authentication Page | Provides the platform authentication interface |
| Citizen Dashboard | Citizen-focused grievance interface |
| Submit Grievance | Allows citizens to communicate public concerns |
| Track Complaint | Provides a dedicated complaint tracking interface |
| Representative Dashboard | Displays constituency grievance intelligence |
| Auxiliary Pages | Provides additional application interfaces |

---

## 🔒 Security & Configuration

SabkiAwaaz includes several application security and configuration practices.

- 🔑 Gemini API credentials are loaded through backend environment variables.
- 🗄️ Database connection configuration is managed through application settings.
- 🌐 FastAPI CORS middleware controls allowed frontend origins.
- 🔒 Sensitive configuration can be separated from application source code through `.env` files.
- 🧩 Pydantic Settings provides structured backend environment configuration.
- 🚫 Secret credentials should never be committed to GitHub.

---

## 🧪 Development Commands

### Frontend

Start development server:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run TypeScript validation:

```bash
npm run lint
```

### Backend

Start development API:

```bash
uvicorn main:app --reload
```

---

## 🔮 Future Scope

The following features can further expand the SabkiAwaaz platform.

| Feature | Description |
|---|---|
| 🎙️ Advanced Voice Grievance Processing | Expand voice-based complaint submission with multilingual speech recognition. |
| 📷 AI Image Analysis | Automatically analyze uploaded civic issue photographs and extract visual concerns. |
| 🗺️ Interactive Constituency Maps | Visualize grievance clusters and public issue density geographically. |
| 🔔 Real-Time Citizen Notifications | Notify citizens when complaint status or priority information changes. |
| 📈 Advanced Analytics | Provide representatives with historical grievance trends and comparative constituency analytics. |
| 📱 Progressive Web Application | Improve mobile accessibility through installable PWA functionality. |
| 🏢 Government Department Integration | Automatically route structured grievances to appropriate public departments. |
| 🔐 Production Authentication & Authorization | Expand identity management and role-based access control for citizens and representatives. |

---

## 🤝 Contributing

Contributions can help improve SabkiAwaaz and expand its capabilities.

### 1. Fork the Repository

Fork the project to your GitHub account.

### 2. Clone Your Fork
