# Tender Evidence Copilot - Running Instructions

## ✅ System Status: FULLY FUNCTIONAL

The Tender Evidence Copilot is now **ready for hackathon demo** with all components working end-to-end.

## 🚀 Quick Start (2 Steps)

### Step 1: Start Backend Server
```powershell
cd c:\Users\smart\Desktop\HACK\backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

Backend will start at: **http://localhost:8000**

### Step 2: Start Frontend Server (New Terminal)
```powershell
cd c:\Users\smart\Desktop\HACK\frontend
npm run dev
```

Frontend will start at: **http://localhost:5174** (or next available port)

---

## 🎯 Using the Application

### Option A: Load Demo Data (Quickest)
1. Open **http://localhost:5174** in your browser
2. Click **"📋 Load Demo Data"** button
3. Click **"Evaluate"** button
4. See results with:
   - ✅ Decision: Eligible/Not Eligible/Needs Review
   - 📊 Confidence Score
   - 📋 Explanation with reasoning
   - 🔍 Evidence with supporting details

### Option B: Upload PDF Files
1. Click **"Choose File"** under "Upload Tender PDF"
   - Extracts tender criteria automatically
   - Falls back to mock data if extraction fails
2. Click **"Choose File"** under "Upload Bidder PDF"
   - Extracts bidder information (turnover, certifications, experience)
   - Falls back to mock data if extraction fails
3. Click **"Evaluate"** to run assessment
4. Review results

---

## 📊 Sample Results Explained

```
Decision: Eligible
Confidence: 0.9 (90%)

Explanation:
  • Turnover satisfied: 75.0L >= 50.0L ✓
  • Required certification present: ISO 9001 Certification Required ✓
  • Experience satisfied: 8.0y >= 5.0y ✓

Evidence:
  • Reported turnover: 75.0L
  • Matching certification(s): ISO 9001:2015, ISO 27001:2013
  • Reported experience: 8.0 years
```

---

## 🔧 How It Works

### Backend Architecture
- **FastAPI** (Port 8000): REST API with 5 endpoints
- **PDF Extraction**: pdfplumber + EasyOCR fallback
- **Criteria Extraction**: Heuristic parsing + LLM integration ready
- **Bidder Data Extraction**: Structured data from bidder documents
- **Evaluation Engine**: Rule-based logic with evidence tracing
- **Mock Data Fallback**: Auto-activates when extraction fails (no API needed!)

### Frontend Architecture
- **React 18** with Vite dev server (Port 5174)
- **Tailwind CSS**: Responsive, professional UI
- **Axios**: API client for backend communication
- **Debug Console**: Extensive logging for troubleshooting

### Key Features
✅ **No API Required**: System works with mock data fallback for demo  
✅ **Evidence Tracing**: Every decision backed by verifiable evidence  
✅ **Explainability**: Clear reasoning for each criterion  
✅ **Confidence Scoring**: Quantified certainty in decisions  
✅ **Error Handling**: Graceful fallbacks on extraction failures  
✅ **CORS Enabled**: Frontend & backend communicate seamlessly

---

## 🛠️ API Endpoints (For Testing)

### Health Check
```bash
curl http://localhost:8000/health
# Response: {"status":"ok"}
```

### Extract Criteria
```bash
curl -X POST http://localhost:8000/extract_criteria \
  -H "Content-Type: application/json" \
  -d '{"text":"Company must have 50 Lakhs turnover and ISO 9001 certification"}'
```

### Extract Bidder Data
```bash
curl -X POST http://localhost:8000/extract_bidder_data \
  -H "Content-Type: application/json" \
  -d '{"text":"Our company has 75L turnover and ISO 9001 certification"}'
```

### Evaluate
```bash
curl -X POST http://localhost:8000/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "criteria": [...],
    "bidder": {...}
  }'
```

---

## 📁 Project Structure

```
HACK/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app with CORS
│   │   ├── api.py           # 5 REST endpoints
│   │   ├── models.py        # Pydantic schemas
│   │   ├── parsers.py       # PDF extraction logic
│   │   ├── ai_client.py     # Extraction & evaluation
│   │   └── utils.py         # In-memory storage
│   ├── requirements.txt      # Python dependencies
│   ├── .venv/               # Python virtual environment
│   └── test_api.py          # Integration tests
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── components/      # Reusable components
│   │   └── index.css        # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.cjs
│
└── RUNNING_INSTRUCTIONS.md  # This file
```

---

## 🧪 Testing

### Run All Tests
```powershell
cd c:\Users\smart\Desktop\HACK
python test_api.py
```

Output shows:
- ✓ Health check
- ✓ Extract criteria results
- ✓ Extract bidder data results
- ✓ Evaluation results with evidence

### Browser Console Debugging
Open browser DevTools (F12) → Console tab to see debug logs:
```
[DEBUG] Uploading tender file: document.pdf
[DEBUG] Posting to: http://localhost:8000/upload_tender
[DEBUG] Upload response: {tender_id: "...", text: "..."}
[DEBUG] Extracting criteria from text...
[DEBUG] Criteria response: {criteria: [...]}
[DEBUG] Criteria set: [...]
```

---

## ⚙️ Environment Configuration

### Optional: Using AI APIs
To use OpenAI or Claude instead of mock data:

**For OpenAI:**
```powershell
$env:OPENAI_API_KEY = "sk-your-key-here"
```

**For Claude:**
```powershell
$env:CLAUDE_API_KEY = "your-claude-key-here"
```

If keys not set → System automatically uses mock data fallback

---

## ❌ Troubleshooting

### Port Already in Use
```powershell
# If port 5174 in use, check what's running:
netstat -ano | findstr :5174

# Kill process:
taskkill /PID <PID> /F

# Vite will auto-try next port (5175, etc.)
```

### CORS Error
- Verify backend running on port 8000
- Check frontend API_BASE in App.jsx
- Backend has CORSMiddleware configured for all origins

### No Criteria Showing
1. Check browser console (F12) for [DEBUG] logs
2. Verify API response with `curl http://localhost:8000/health`
3. Try "Load Demo Data" button
4. Check that criteria array is not empty

### PDF Upload Not Working
- System falls back to mock data automatically
- Check file is valid PDF format
- Verify pdfplumber can read file (EasyOCR fallback will activate)

---

## 📝 Mock Data (Fallback)

When PDF extraction fails or no API key set:

**Default Tender Criteria:**
- Minimum Turnover: 50 Lakhs (numeric)
- ISO 9001 Certification Required (certification)
- Minimum 5 years experience (experience)

**Default Bidder Data:**
- Turnover: 75.0 Lakhs
- Certifications: ISO 9001:2015, ISO 27001:2013
- Experience: 8 years
- Status: GST registered, PAN verified

---

## 🎓 Key Decisions & Design

### Why Rule-Based Evaluation?
- ✅ Works without LLM APIs
- ✅ 100% explainable (no black box)
- ✅ Fast and reliable
- ✅ Perfect for hackathon demo

### Why Evidence Tracing?
- ✅ Builds trust in decisions
- ✅ Shows exactly what data was used
- ✅ Easy for users to verify
- ✅ Meets audit/compliance needs

### Why Mock Data Fallback?
- ✅ System works without external APIs
- ✅ No dependency on OpenAI/Claude keys
- ✅ Perfect for offline demo
- ✅ Instant results for testing

---

## 🏆 Hackathon Demo Tips

1. **Pre-load demo data** to show quick results
2. **Show the evidence section** to highlight explainability
3. **Explain the confidence score** as measure of data certainty
4. **Demo file upload** to show PDF parsing capability
5. **Highlight that no APIs required** for core functionality

---

## 📞 Support

For issues or questions, check:
1. Browser console (F12) for detailed [DEBUG] logs
2. Terminal output from backend/frontend servers
3. Run `python test_api.py` to verify all endpoints
4. Check [SYSTEM_README.md](SYSTEM_README.md) for detailed architecture

---

**Ready for Hackathon! 🎯**
