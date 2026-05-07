# Tender Evidence Copilot — Frontend

Simple React + Vite frontend that connects to the FastAPI backend.

Run (development)

1. Install dependencies

```bash
cd frontend
npm install
```

2. Start dev server

```bash
npm run dev
```

- By default the frontend calls `https://crpf-tender-portal.onrender.com`. To change, set `VITE_API_BASE` in your environment.

Folder structure

```
HACK/
├─ backend/         # FastAPI app
├─ frontend/        # React + Vite + Tailwind frontend
	├─ src/
	├─ index.html
	└─ package.json
```

Features
- Upload Tender PDF (calls `/upload_tender` + `/extract_criteria`)
- Upload Bidder PDF (calls `/upload_bidder` + `/extract_bidder_data`)
- Evaluate (calls `/evaluate`) and shows decision, confidence and reasons
