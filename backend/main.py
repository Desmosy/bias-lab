import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Dict
from datetime import datetime, timedelta


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    from fastapi.openapi.utils import get_openapi
    openapi_schema = get_openapi(
        title="🧠 Bias Lab API",
        version="0.2.0",
        description="AI-powered media bias detection and analysis API. Identify ideological stance, factual grounding, framing choices, emotional tone, and source transparency in news articles.",
        routes=app.routes,
    )
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app = FastAPI(
    title="🧠 Bias Lab API", 
    version="0.2.0",
    description="AI-powered media bias detection and analysis API. Identify ideological stance, factual grounding, framing choices, emotional tone, and source transparency in news articles.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS: allow specific origins in prod via env FRONTEND_ORIGINS (comma-separated). Defaults to * for dev.
_frontend_origins_env = os.getenv("FRONTEND_ORIGINS")
allow_origins = [o.strip() for o in _frontend_origins_env.split(",")] if _frontend_origins_env else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.openapi = custom_openapi
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return HTMLResponse("""
<!DOCTYPE html>
<html>
<head>
    <link type="text/css" rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.css" />
    <link type="text/css" rel="stylesheet" href="/static/custom.css" />
    <title>🧠 Bias Lab API</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>">
</head>
<body>
    <div id="swagger-ui">
    </div>
    <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
    <script>
    const ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIBundle.presets.standalone
        ],
        layout: "StandaloneLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true
    })
    </script>
</body>
</html>
    """)

BiasDimension = Literal[
    "ideological_stance",
    "factual_grounding",
    "framing_choices",
    "emotional_tone",
    "source_transparency",
]


class BiasScores(BaseModel):
    ideological_stance: float = Field(ge=0.0, le=1.0)
    factual_grounding: float = Field(ge=0.0, le=1.0)
    framing_choices: float = Field(ge=0.0, le=1.0)
    emotional_tone: float = Field(ge=0.0, le=1.0)
    source_transparency: float = Field(ge=0.0, le=1.0)


class Highlight(BaseModel):
    start: int
    end: int
    dimension: BiasDimension
    note: Optional[str] = None


class PrimarySource(BaseModel):
    title: str
    url: str


class ArticleSummary(BaseModel):
    id: str
    title: str
    source: str
    date: datetime
    bias: BiasScores
    excerpt: Optional[str] = None


class ArticleDetail(ArticleSummary):
    content: str
    highlights: List[Highlight]
    primary_sources: List[PrimarySource] = []


class ClusterArticle(BaseModel):
    id: str
    title: str


class NarrativeCluster(BaseModel):
    id: str
    title: str
    description: str
    divergence_index: float = Field(ge=0.0, le=1.0)
    top_articles: List[ClusterArticle]


# ---------------------
# Mock Data
# ---------------------

_ARTICLES: Dict[str, ArticleDetail] = {}

_content_a = (
    "The committee released its preliminary findings on Tuesday, "
    "noting significant inconsistencies in the testimony of key witnesses. "
    "Critics argue the report downplays systemic issues, while supporters claim it emphasizes concrete steps forward. "
    "According to documents published alongside the report, several data sources were made publicly accessible."
)

_ARTICLES["a1"] = ArticleDetail(
    id="a1",
    title="Committee Releases Preliminary Findings Amid Debate",
    source="Civic Daily",
    date=datetime(2024, 11, 3, 9, 0, 0),
    bias=BiasScores(
        ideological_stance=0.45,
        factual_grounding=0.82,
        framing_choices=0.61,
        emotional_tone=0.35,
        source_transparency=0.9,
    ),
    excerpt="Preliminary findings spark debate over framing and transparency...",
    content=_content_a,
    highlights=[
        Highlight(start=4, end=13, dimension="ideological_stance", note="Ambiguous agency/attribution"),
        Highlight(start=88, end=102, dimension="framing_choices", note="Downplays responsibility"),
        Highlight(start=247, end=279, dimension="source_transparency", note="Public data availability"),
    ],
    primary_sources=[
        PrimarySource(title="Hearing Transcript", url="https://example.org/transcript.pdf"),
        PrimarySource(title="Document Repository", url="https://example.org/repo"),
    ],
)

_content_b = (
    "In a sharply worded editorial, the publication criticized the proposed changes, "
    "calling them a distraction from pressing economic concerns. "
    "Analysts, however, pointed to multiple studies indicating modest long-term benefits."
)

_ARTICLES["a2"] = ArticleDetail(
    id="a2",
    title="Editorial Questions Proposed Changes",
    source="Beacon Tribune",
    date=datetime(2024, 11, 2, 14, 30, 0),
    bias=BiasScores(
        ideological_stance=0.62,
        factual_grounding=0.56,
        framing_choices=0.71,
        emotional_tone=0.7,
        source_transparency=0.52,
    ),
    excerpt="Editorial frames proposal as distraction amid economic concerns...",
    content=_content_b,
    highlights=[
        Highlight(start=5, end=22, dimension="emotional_tone", note="Loaded language"),
        Highlight(start=165, end=197, dimension="factual_grounding", note="References unnamed studies"),
    ],
    primary_sources=[
        PrimarySource(title="Policy Whitepaper", url="https://example.org/whitepaper"),
    ],
)

_ARTICLES["a3"] = ArticleDetail(
    id="a3",
    title="Local Groups Launch Transparency Initiative",
    source="Open Ledger",
    date=datetime(2024, 11, 1, 8, 15, 0),
    bias=BiasScores(
        ideological_stance=0.38,
        factual_grounding=0.88,
        framing_choices=0.44,
        emotional_tone=0.25,
        source_transparency=0.96,
    ),
    excerpt="Community organizations publish datasets and invite audits...",
    content=(
        "Community groups announced a new transparency initiative. "
        "Data will be published in open formats with clear provenance."
    ),
    highlights=[
        Highlight(start=0, end=16, dimension="framing_choices", note="Collective agency"),
        Highlight(start=73, end=112, dimension="source_transparency", note="Open data commitment"),
    ],
    primary_sources=[
        PrimarySource(title="Open Data Portal", url="https://example.org/open-data"),
    ],
)

_ARTICLES["a4"] = ArticleDetail(
    id="a4",
    title="Experts Split on Long-Term Impact of Policy",
    source="Policy Watch",
    date=datetime(2024, 10, 29, 12, 0, 0),
    bias=BiasScores(
        ideological_stance=0.5,
        factual_grounding=0.67,
        framing_choices=0.58,
        emotional_tone=0.42,
        source_transparency=0.6,
    ),
    excerpt="Experts disagree over the policy's long-term outcomes...",
    content=(
        "Experts expressed differing views on the policy's long-term impact. "
        "Several cited case studies with mixed results."
    ),
    highlights=[
        Highlight(start=0, end=7, dimension="ideological_stance", note="Appeal to authority"),
        Highlight(start=87, end=98, dimension="factual_grounding", note="Case studies referenced"),
    ],
    primary_sources=[],
)

_ARTICLES["a5"] = ArticleDetail(
    id="a5",
    title="Protests Erupt as Vote Nears",
    source="Metro Herald",
    date=datetime(2024, 10, 28, 18, 45, 0),
    bias=BiasScores(
        ideological_stance=0.57,
        factual_grounding=0.49,
        framing_choices=0.76,
        emotional_tone=0.82,
        source_transparency=0.4,
    ),
    excerpt="Protests intensify ahead of the contentious vote...",
    content=(
        "Protesters gathered downtown, with organizers calling for urgent action. "
        "Officials emphasized safety and order in the lead-up to the vote."
    ),
    highlights=[
        Highlight(start=0, end=10, dimension="emotional_tone", note="Intensifying language"),
        Highlight(start=96, end=115, dimension="framing_choices", note="Officials' emphasis"),
    ],
    primary_sources=[],
)

# Add more realistic articles with varied content
article_data = [
    {
        "id": "a6", "title": "Tech Giants Face New Regulatory Scrutiny",
        "source": "Digital Times", "content": "Silicon Valley companies are bracing for unprecedented regulatory oversight as lawmakers draft sweeping legislation targeting digital monopolies. Industry leaders warn of stifling innovation, while consumer advocates celebrate the long-overdue reforms.",
        "highlights": [(0, 14, "ideological_stance", "Corporate framing"), (78, 95, "emotional_tone", "Loaded language")]
    },
    {
        "id": "a7", "title": "Climate Summit Yields Mixed Results",
        "source": "Global Watch", "content": "International delegates concluded climate negotiations with what organizers called 'meaningful progress' despite failing to reach consensus on critical emissions targets. Environmental groups expressed disappointment with the watered-down commitments.",
        "highlights": [(75, 93, "framing_choices", "Euphemistic language"), (165, 178, "emotional_tone", "Strong sentiment")]
    },
    {
        "id": "a8", "title": "Healthcare Reform Proposal Sparks Debate",
        "source": "Policy Tribune", "content": "The administration's healthcare overhaul has divided stakeholders across the political spectrum. Medical professionals cite concerns about implementation timelines, while patient advocacy groups hail the expanded coverage provisions.",
        "highlights": [(20, 29, "framing_choices", "Neutral framing"), (67, 74, "ideological_stance", "Political positioning")]
    },
    {
        "id": "a9", "title": "Economic Indicators Show Cautious Optimism",
        "source": "Financial Herald", "content": "Leading economists interpret recent data as signs of sustained recovery, though inflation concerns continue to temper market enthusiasm. Federal Reserve officials maintain their data-dependent approach to policy adjustments.",
        "highlights": [(46, 58, "factual_grounding", "Expert analysis"), (102, 108, "emotional_tone", "Cautious language")]
    },
    {
        "id": "a10", "title": "Education Technology Transforms Classrooms",
        "source": "Learning Today", "content": "Schools nationwide report significant improvements in student engagement following the implementation of AI-powered learning platforms. However, digital equity concerns persist in underserved communities.",
        "highlights": [(15, 21, "factual_grounding", "Quantitative claim"), (124, 132, "framing_choices", "Problem framing")]
    }
]

base_date = datetime(2024, 10, 20, 9, 0, 0)
for i, data in enumerate(article_data):
    idx = data["id"]
    _ARTICLES[idx] = ArticleDetail(
        id=idx,
        title=data["title"],
        source=data["source"],
        date=base_date + timedelta(days=i+6),
        bias=BiasScores(
            ideological_stance=max(0.0, min(1.0, 0.35 + (i % 4) * 0.15)),
            factual_grounding=max(0.0, min(1.0, 0.65 + (i % 3) * 0.1)),
            framing_choices=max(0.0, min(1.0, 0.45 + (i % 5) * 0.12)),
            emotional_tone=max(0.0, min(1.0, 0.25 + (i % 4) * 0.18)),
            source_transparency=max(0.0, min(1.0, 0.55 + (i % 3) * 0.15)),
        ),
        excerpt=f"Analysis of {data['title'].lower()} reveals nuanced coverage patterns...",
        content=data["content"],
        highlights=[Highlight(start=h[0], end=h[1], dimension=h[2], note=h[3]) for h in data["highlights"]],
        primary_sources=[
            PrimarySource(title="Research Report", url="https://example.org/research"),
            PrimarySource(title="Official Statement", url="https://example.org/statement"),
        ],
    )

_NARRATIVES: List[NarrativeCluster] = [
    NarrativeCluster(
        id="n1",
        title="Tech Giants Face New Regulatory Scrutiny",
        description="Coverage ranges from industry defense to consumer advocacy, revealing deep ideological divides on corporate accountability.",
        divergence_index=0.72,
        top_articles=[
            ClusterArticle(id="a6", title=_ARTICLES["a6"].title),
            ClusterArticle(id="a1", title=_ARTICLES["a1"].title),
            ClusterArticle(id="a3", title=_ARTICLES["a3"].title),
        ],
    ),
    NarrativeCluster(
        id="n2", 
        title="Climate Summit Yields Mixed Results",
        description="Reports balance cautious diplomatic language with urgent environmental advocacy.",
        divergence_index=0.58,
        top_articles=[
            ClusterArticle(id="a7", title=_ARTICLES["a7"].title),
            ClusterArticle(id="a2", title=_ARTICLES["a2"].title),
        ],
    ),
    NarrativeCluster(
        id="n3",
        title="Healthcare Reform Proposal Sparks Debate",
        description="Coverage reveals partisan framing differences, with policy implementation concerns competing against access advocacy.",
        divergence_index=0.45,
        top_articles=[
            ClusterArticle(id="a8", title=_ARTICLES["a8"].title),
            ClusterArticle(id="a9", title=_ARTICLES["a9"].title),
        ],
    ),
    NarrativeCluster(
        id="n4",
        title="Economic Indicators Show Cautious Optimism",
        description="Financial experts interpret market signals differently across outlets.",
        divergence_index=0.39,
        top_articles=[
            ClusterArticle(id="a9", title=_ARTICLES["a9"].title),
        ],
    ),
    NarrativeCluster(
        id="n5",
        title="Education Technology Transforms Classrooms",
        description="Narratives split between innovation celebration and digital equity concerns.",
        divergence_index=0.52,
        top_articles=[
            ClusterArticle(id="a10", title=_ARTICLES["a10"].title),
        ],
    ),
    NarrativeCluster(
        id="n6",
        title="Committee Releases Preliminary Findings Amid Debate",
        description="Official findings receive varied coverage depending on outlet perspective.",
        divergence_index=0.63,
        top_articles=[
            ClusterArticle(id="a1", title=_ARTICLES["a1"].title),
        ],
    ),
]


# ---------------------
# Helpers
# ---------------------

def _to_summary(article: ArticleDetail) -> ArticleSummary:
    return ArticleSummary(
        id=article.id,
        title=article.title,
        source=article.source,
        date=article.date,
        bias=article.bias,
        excerpt=article.excerpt,
    )


# ---------------------
# Routes
# ---------------------

@app.get("/health")
async def health() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/articles", response_model=List[ArticleSummary])
def list_articles() -> List[ArticleSummary]:
    return sorted([_to_summary(a) for a in _ARTICLES.values()], key=lambda a: a.date, reverse=True)


@app.get("/articles/{article_id}", response_model=ArticleDetail)
def get_article(article_id: str) -> ArticleDetail:
    article = _ARTICLES.get(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article


@app.get("/narratives", response_model=List[NarrativeCluster])
def list_narratives() -> List[NarrativeCluster]:
    return _NARRATIVES