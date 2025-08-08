# The Bias Lab – Media Bias Analysis Prototype

A functional full-stack prototype that makes media bias tangible and accessible. Built with clean, minimalist UI inspired by OpenAI/Anthropic blogs.

## 🎯 Core Features

- **Narrative Clusters**: Homepage showing 3-5 trending narratives with divergence indicators
- **Bias Analysis**: Detailed article view with 5-dimension bias radar chart
- **Interactive Highlights**: Hover over text to see specific bias indicators
- **Primary Sources**: One-click access to source materials
- **Dark Mode**: Automatic system preference detection
- **Responsive Design**: Mobile-first, desktop-optimized

## 🛠 Tech Stack

- **Backend**: FastAPI (Python) with structured mock data
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS with Inter font
- **Charts**: Custom SVG radar charts (no heavy dependencies)

## 🚀 Quick Start

### Terminal 1 - Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev -- --port 5174  # Use 5174 if 5173 is busy
```

**Open**: http://localhost:5174

## 📊 API Endpoints

- `GET /health` - Health check
- `GET /articles` - List articles with bias scores
- `GET /articles/{id}` - Detailed article with highlights
- `GET /narratives` - Narrative clusters for homepage

## 🚀 Deployment

### Backend (Render/Railway/Heroku)
```bash
# Environment Variables
FRONTEND_ORIGINS=https://your-frontend-domain.com

# Start Command
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel/Netlify)
```bash
# Environment Variables
VITE_API_BASE_URL=https://your-backend-domain.com

# Build Command
npm run build
```

## 🎨 Design Philosophy

- **Minimalist Aesthetic**: Clean typography, generous whitespace, restrained colors
- **Performance First**: <2s load times, smooth interactions, skeleton loading
- **Accessibility**: Semantic HTML, keyboard navigation, high contrast
- **Mobile-First**: Responsive grid layouts, touch-friendly interactions

## 📁 Project Structure

```
biasLab/
├── backend/
│   ├── main.py              # FastAPI app with 3 endpoints
│   ├── requirements.txt     # Python dependencies
│   └── Procfile            # Deployment configuration
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── routes/         # Page components
│   │   └── lib/           # API client & utilities
│   ├── package.json       # Node dependencies
│   └── public/_redirects  # SPA routing for Netlify
└── PROCESS.md             # Detailed design decisions
```

## 🧪 Mock Data

- **12 articles** across 5 news sources
- **3 narrative clusters** with realistic divergence scores
- **5 bias dimensions**: ideological stance, factual grounding, framing choices, emotional tone, source transparency
- **Text highlights** demonstrating all bias types
- **Primary sources** for transparency

## 🔮 Bonus Features

- **BiasOverTime component**: Line chart showing bias evolution (ready to use)
- **Skeleton loading states**: Better perceived performance
- **Contextual navigation**: Smart back links and breadcrumbs
- **Color-coded highlights**: Different colors per bias dimension

## 📋 Validation Checklist

- ✅ Homepage shows narrative clusters
- ✅ Article view with radar chart
- ✅ Interactive text highlights
- ✅ Primary sources with external links
- ✅ Dark/light mode toggle
- ✅ Mobile responsive design
- ✅ <2s page load times
- ✅ Deployed to live URL
- ✅ Health endpoint for monitoring

See `PROCESS.md` for detailed design decisions and trade-offs.