# Deployment Setup

Use this simplest setup:

1. Deploy the backend on Render.
2. Deploy the frontend on Vercel.
3. Set `VITE_API_BASE` in Vercel to the Render backend URL.

## Backend on Render

Render will use the root `render.yaml` file in this repo.

Required Render environment variable:

- `GEMINI_API_KEY`

## Frontend on Vercel

Add this environment variable in Vercel:

- Key: `VITE_API_BASE`
- Value: `https://your-backend.onrender.com`

Do not use `localhost` in production.
