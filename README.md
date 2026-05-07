# 🏛️ CRPF Tender Evaluation Portal

> **AI-Powered Tender Management System** built for the CRPF procurement workflow.  
> Instantly evaluates vendor bids against mandatory tender criteria using Google Gemini AI.

---

## 🎬 Demo Video

[![Backend Demo](https://img.shields.io/badge/Watch-Backend%20Demo-red?style=for-the-badge&logo=youtube)](./backend_demo_video.mp4)

---

## ✨ Features

- 📄 **Upload Tender Documents** — PDF & DOCX support
- 🤖 **AI Criteria Extraction** — Automatically extracts mandatory requirements from tender text
- 🧾 **Upload Bidder Documents** — Parse vendor submissions instantly
- ⚖️ **Automated Evaluation** — Rule-based + AI explanation engine
- ✅ **Eligible / Ineligible Decision** with confidence score & reasons
- 💬 **AI Copilot Chatbot** — Ask questions about any tender or bidder
- 📊 **Dashboard** — Active tenders, archive, document management
- 🔒 **CORS-enabled REST API** — Ready to connect any frontend

---

## 🗂️ Project Structure

```
HACK/
├── backend/                  # FastAPI Python Backend
│   ├── app/
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── api.py            # All API routes
│   │   ├── ai_client.py      # Google Gemini AI integration
│   │   ├── models.py         # Pydantic data models
│   │   ├── parsers.py        # PDF/DOCX text extraction
│   │   └── utils.py          # In-memory storage utilities
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Environment variables template
│
└── frontend/                 # React + Vite Frontend
    ├── src/
    │   ├── App.jsx            # Main app with routing
    │   ├── components/        # All page components
    │   └── index.css          # Global styles
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

---

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set up environment
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run the server
uvicorn app.main:app --reload --port 8000
```

Backend will be live at: **http://localhost:8000**  
Interactive API docs: **http://localhost:8000/docs**

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend will be live at: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/upload_tender` | Upload tender PDF/DOCX |
| `POST` | `/extract_criteria` | AI-extract mandatory criteria |
| `POST` | `/upload_bidder` | Upload bidder PDF/DOCX |
| `POST` | `/extract_bidder_data` | Extract bidder info |
| `POST` | `/evaluate` | Evaluate bidder against criteria |
| `POST` | `/chat` | AI copilot chat |

Full Swagger docs available at `/docs` when server is running.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TailwindCSS |
| **Backend** | FastAPI, Python 3.9+ |
| **AI Engine** | Google Gemini 1.5 Flash |
| **Document Parsing** | PyMuPDF, python-docx |
| **API Docs** | Swagger UI (auto-generated) |

---

## 📝 Environment Variables

Create a `.env` file in the `backend/` folder:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Get your free API key at: https://aistudio.google.com/app/apikey

---

## 👥 Team

Built with ❤️ for the Hackathon — CRPF Tender Management Challenge

---

## 📄 License

MIT License — free to use and modify.
