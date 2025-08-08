# The Bias Lab – Prototype

A minimal full‑stack prototype to make media bias tangible. Backend: FastAPI. Frontend: React + TypeScript + Vite + Tailwind.

## Local development

- Backend
  - Python 3.11+
  - Install: `pip install -r backend/requirements.txt`
  - Run: `uvicorn main:app --reload --port 8000` from `backend/`
  - API: http://localhost:8000

- Frontend
  - Node 18+
  - Install: `npm i` in `frontend/`
  - Dev: `npm run dev` (Vite on http://localhost:5173)
  - The dev server proxies `/api` → `http://localhost:8000`.

## Deploy

- Frontend: Vercel/Netlify. Set `VITE_API_BASE_URL` env to your backend URL.
- Backend: Railway/Render/Fly/Heroku. Use `backend/Procfile` or command `uvicorn main:app --host 0.0.0.0 --port $PORT`.

## Endpoints

- GET `/articles` → list of article summaries
- GET `/articles/{id}` → article detail with highlights and sources
- GET `/narratives` → narrative clusters with top articles