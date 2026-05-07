# Tender Evidence Copilot — Backend Prototype

This directory contains a FastAPI backend prototype for the "Tender Evidence Copilot" hackathon project.

Features
- Upload Tender PDF and extract structured eligibility criteria
- Upload Bidder PDF and extract bidder evidence
- Compare tender criteria vs bidder evidence and return decision + explanation + confidence

Run (development)

1. Create a Python environment (recommended Python 3.9+)

```bash
python -m venv .venv
# Windows activate
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```


2. API endpoints
- `POST /upload_tender` — multipart form `file` (PDF). Returns `tender_id` and extracted text.
- `POST /extract_criteria` — JSON body `{ "text": "..." }` returns structured criteria JSON.
- `POST /upload_bidder` — multipart form `file` (PDF). Returns `bidder_id` and extracted text.
- `POST /extract_bidder_data` — JSON body `{ "text": "..." }` returns bidder structured data (turnover, certifications, experience).
- `POST /evaluate` — JSON body `{ "criteria": [...], "bidder": {...} }` returns decision, confidence and reasons.

Notes
- This is a prototype. The AI extraction is implemented as a heuristic stub unless an OpenAI API key (env `OPENAI_API_KEY`) is provided. Replace with real API integration for production.
