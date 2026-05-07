# Tender Evidence Copilot — Complete Prototype

A full-stack hackathon project that demonstrates **explainable AI for tender evaluation**. Every decision is backed by verifiable evidence.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   Tender Evidence Copilot                   │
├─────────────────────────────────────────────────────────────┤
│  React Frontend (Vite + Tailwind)                           │
│  - Upload PDFs, view extracted data, see decisions          │
├─────────────────────────────────────────────────────────────┤
│  FastAPI Backend                                            │
│  - PDF parsing (pdfplumber + EasyOCR fallback)             │
│  - Structured extraction (heuristic + LLM-ready)           │
│  - Rule-based evaluation engine                            │
│  - Evidence collection and tracing                          │
└─────────────────────────────────────────────────────────────┘
```

## Features

✅ **PDF Parsing**
- Extract text from tender and bidder PDFs using pdfplumber
- Automatic fallback to EasyOCR for scanned documents

✅ **Structured Extraction**
- Extract eligibility criteria (turnover, certifications, experience)
- Extract bidder information (financials, certificates, background)
- JSON-structured output for downstream processing

✅ **Explainable Evaluation**
- Rule-based engine with deterministic logic
- Optional LLM integration (OpenAI/Claude) for semantic analysis
- **Verifiable evidence** attached to every decision

✅ **Clean UI**
- Upload tender and bidder PDFs
- View extracted criteria cards
- See decision + confidence + explanation + evidence
- All built with Tailwind CSS

## Project Structure

```
HACK/
├─ backend/                    # FastAPI application
│  ├─ app/
│  │  ├─ main.py             # FastAPI app + CORS
│  │  ├─ api.py              # Route handlers
│  │  ├─ models.py           # Pydantic schemas
│  │  ├─ parsers.py          # PDF extraction
│  │  ├─ ai_client.py        # LLM + rule engine
│  │  └─ utils.py            # Storage helpers
│  ├─ requirements.txt
│  └─ README.md
│
├─ frontend/                   # React + Vite frontend
│  ├─ src/
│  │  ├─ App.jsx             # Main component
│  │  ├─ main.jsx            # Entry point
│  │  ├─ index.css           # Tailwind imports
│  │  └─ components/
│  │     └─ CriteriaCard.jsx # Criteria display
│  ├─ index.html
│  ├─ package.json
│  ├─ tailwind.config.cjs
│  ├─ postcss.config.cjs
│  └─ README.md
│
├─ test_api.py               # End-to-end test script
└─ README.md                 # This file
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate    # macOS/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend will be available at **http://localhost:8000**

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at **http://localhost:5173**

### 3. Test the Full Flow

With both servers running, execute the end-to-end test:

```bash
python test_api.py
```

This will:
1. Extract criteria from a sample tender
2. Extract bidder data from a sample bidder document
3. Evaluate and return decision with evidence

## API Endpoints

### `/upload_tender` (POST)
Upload tender PDF and extract text.
```bash
curl -F "file=@tender.pdf" http://localhost:8000/upload_tender
```
Response:
```json
{
  "tender_id": "tender_abc123",
  "text": "..."
}
```

### `/extract_criteria` (POST)
Extract structured criteria from tender text.
```json
{
  "text": "Tender eligibility: Turnover > 50L, ISO 9001 required..."
}
```
Response:
```json
{
  "criteria": [
    {"criterion": "Turnover > 50L", "type": "numeric", "threshold": 50.0},
    {"criterion": "ISO 9001", "type": "certification"}
  ]
}
```

### `/upload_bidder` (POST)
Upload bidder PDF and extract text.

### `/extract_bidder_data` (POST)
Extract structured bidder information.
```json
{
  "text": "Company turnover: 75L. Certifications: ISO 9001. Experience: 8 years."
}
```
Response:
```json
{
  "bidder": {
    "turnover": 75.0,
    "certifications": ["ISO 9001:2015"],
    "experience_years": 8.0
  }
}
```

### `/evaluate` (POST)
Compare criteria vs bidder data and return decision + evidence.
```json
{
  "criteria": [...],
  "bidder": {...}
}
```
Response:
```json
{
  "decision": "Eligible",
  "confidence": 0.95,
  "reasons": [
    "Turnover satisfied: 75L >= 50L",
    "ISO certification present"
  ],
  "evidence": [
    "Reported turnover: 75.0L",
    "Matching certification(s): ISO 9001:2015"
  ]
}
```

## Evaluation Logic

The system uses a **rule-based engine** with optional LLM enhancement:

### Rule-Based (Always Active)
- **Numeric criteria**: If bidder value < threshold → Not Eligible
- **Certification criteria**: If required cert missing → Not Eligible
- **Experience criteria**: If years < required → Not Eligible
- **Text criteria**: Keyword matching against raw excerpts

### Result Decision
- **Eligible**: All rules pass
- **Not Eligible**: Any rule fails
- **Needs Review**: Missing data or conflicting evidence

### Evidence Tracing
Every decision includes **verifiable evidence**:
- Reported financial values (turnover, experience)
- Matching certificates (with exact names)
- Text excerpts matching criteria
- Data completeness assessment

## LLM Integration (Optional)

To enable AI-based extraction and evaluation:

```bash
# Set API keys in environment
export OPENAI_API_KEY="sk-..."
# or
export CLAUDE_API_KEY="sk-ant-..."

# Restart backend
uvicorn app.main:app --reload --port 8000
```

When enabled:
- `extract_criteria()` uses LLM for semantic parsing
- `extract_bidder()` uses LLM for information extraction
- `evaluate()` includes LLM reasoning (conflicts → "Needs Review")

## Tech Stack

**Backend:**
- FastAPI 0.95.2
- pdfplumber 0.7.6 (PDF text extraction)
- EasyOCR 1.6.2 (fallback OCR)
- Pydantic (data validation)
- requests (HTTP calls to LLM APIs)

**Frontend:**
- React 18.2.0
- Vite 5.0.0 (bundler)
- Tailwind CSS 3.4.7 (styling)
- axios 1.4.0 (API calls)

## Key Design Decisions

1. **Modular architecture**: Separate extraction, evaluation, UI concerns
2. **Rule-based evaluation**: Deterministic, auditable, fast
3. **LLM as optional layer**: Works without keys, but supports semantic analysis
4. **Evidence collection**: Every decision backed by extracted data
5. **CORS enabled**: Frontend development on different port
6. **In-memory storage**: Prototype scope (use DB for production)

## Example Workflow

1. Upload tender PDF → System extracts criteria
2. Upload bidder PDF → System extracts bidder info
3. Click Evaluate → Rule engine + optional LLM processing
4. See result: Decision, Confidence, Explanation, Evidence
5. Evidence directly links back to source documents

## Development Notes

- Backend watches for code changes (hot reload enabled)
- Frontend Vite dev server with fast refresh
- Test script (`test_api.py`) demonstrates full end-to-end flow
- Error handling for invalid PDFs (graceful fallback to OCR)
- CORS configured for `localhost:5173` frontend development

## Production Checklist

- [ ] Replace in-memory storage with database (PostgreSQL/MongoDB)
- [ ] Add authentication and authorization
- [ ] Enable PDF upload size limits
- [ ] Implement persistent document versioning
- [ ] Add audit logging for all decisions
- [ ] Deploy backend and frontend separately
- [ ] Use proper LLM API error handling and retries
- [ ] Add monitoring and alerting

## Statement

> **This system ensures explainable AI — every decision is backed by verifiable evidence.**

Each evaluation decision includes:
- Structured reasoning (why each criterion passed/failed)
- Extracted values from source documents
- Confidence scoring based on data completeness
- Traceable audit trail

---

**Status**: Hackathon prototype ✅ Ready for demo and user testing
