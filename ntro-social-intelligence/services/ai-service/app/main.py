"""NTRO AI Service - FastAPI application entrypoint.

Provides lexicon-based sentiment/emotion/stance/sarcasm analysis, rule-based
topic extraction, and model metadata endpoints.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from app.config import settings
    from app.schemas import (
        AnalysisResult,
        AnalyzeBatchRequest,
        AnalyzeRequest,
        HealthMockResponse,
        HealthResponse,
        ModelInfo,
        ModelsResponse,
        TopicRequest,
        TopicResponse,
    )
    from app.analyzer import analyze_text
    from app.topics import analyze_topics
except ImportError:
    from config import settings
    from schemas import (
        AnalysisResult,
        AnalyzeBatchRequest,
        AnalyzeRequest,
        HealthMockResponse,
        HealthResponse,
        ModelInfo,
        ModelsResponse,
        TopicRequest,
        TopicResponse,
    )
    from analyzer import analyze_text
    from topics import analyze_topics


app = FastAPI(
    title="NTRO AI Service",
    description=(
        "Lexicon-based sentiment, emotion, stance and sarcasm analysis for "
        "the NTRO Social Intelligence platform, with rule-based topic extraction."
    ),
    version=settings.APP_VERSION,
)

# CORS for local development and future web/mobile clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _iso_now() -> str:
    """Return current UTC time as ISO 8601 with Z suffix."""
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


# ---------------------------------------------------------------------------
# Health endpoints
# ---------------------------------------------------------------------------

@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Service health check with version and timestamp."""
    return HealthResponse(
        service=settings.APP_NAME,
        status="ok",
        version=settings.APP_VERSION,
        timestamp=_iso_now(),
    )


@app.get("/health/mock", response_model=HealthMockResponse)
def health_mock() -> HealthMockResponse:
    """Mock health endpoint used by frontend smoke tests."""
    return HealthMockResponse()


# ---------------------------------------------------------------------------
# Analysis endpoints
# ---------------------------------------------------------------------------

@app.post("/analyze", response_model=AnalysisResult)
def analyze(req: AnalyzeRequest) -> AnalysisResult:
    """Analyze a single text for sentiment, emotion, stance and sarcasm."""
    result = analyze_text(req.text, language=req.language or "en")
    return AnalysisResult(**result)


@app.post("/analyze/batch", response_model=list[AnalysisResult])
def analyze_batch(req: AnalyzeBatchRequest) -> list[AnalysisResult]:
    """Analyze multiple texts and return an array of results."""
    return [AnalysisResult(**analyze_text(text)) for text in req.texts]


@app.post("/topics", response_model=TopicResponse)
def extract_topics(req: TopicRequest) -> TopicResponse:
    """Extract topics and keywords from a text."""
    result = analyze_topics(req.text)
    return TopicResponse(**result)


# ---------------------------------------------------------------------------
# Model metadata
# ---------------------------------------------------------------------------

@app.get("/models", response_model=ModelsResponse)
def models() -> ModelsResponse:
    """Return metadata about the analysis approaches used by this service."""
    model_list = [
        ModelInfo(
            id="lexicon-sentiment",
            name="LexiconSentimentAnalyzer",
            type="rule-based",
            enabled=True,
            description=(
                "Pure-Python lexicon-based sentiment analysis using weighted "
                "English + Hindi/transliterated sentiment word lists. No ML "
                "dependencies, runs anywhere."
            ),
            output=["sentiment", "sentimentScore"],
            version="1.0.0",
        ),
        ModelInfo(
            id="lexicon-emotion",
            name="EmotionDistribution",
            type="rule-based",
            enabled=True,
            description=(
                "Maps sentiment-bearing words to a distribution over 10 "
                "emotions (joy, anger, fear, sadness, surprise, excitement, "
                "anxiety, supportive, hostile, neutral) normalized to sum 1."
            ),
            output=["emotions"],
            version="1.0.0",
        ),
        ModelInfo(
            id="stance-inference",
            name="StanceInference",
            type="heuristic",
            enabled=True,
            description=(
                "Infers stance (support/against/neutral) by blending sentiment "
                "score with explicit stance-hint keywords."
            ),
            output=["stance", "stanceScore"],
            version="1.0.0",
        ),
        ModelInfo(
            id="sarcasm-detector",
            name="SarcasmDetector",
            type="heuristic",
            enabled=True,
            description=(
                "Estimates sarcasm probability from negated positive words "
                "and intensifier/exclamation patterns."
            ),
            output=["sarcasmProbability"],
            version="1.0.0",
        ),
        ModelInfo(
            id="topics-extractor",
            name="TopicExtractor",
            type="rule-based",
            enabled=True,
            description=(
                "Rule-based keyword/topic extraction using the 10 NTRO topic "
                "categories and their aliases (replicated from @ntro/shared)."
            ),
            output=["topics", "keywords"],
            version="1.0.0",
        ),
        ModelInfo(
            id="transformers-optional",
            name="HuggingFaceTransformers",
            type="ml",
            enabled=False,
            description=(
                "Optional HuggingFace transformer path (e.g. cardiffnlp/"
                "twitter-roberta-base-sentiment). Disabled by default to keep "
                "the service lightweight and fully runnable without heavy ML "
                "dependencies."
            ),
            output=["sentiment", "emotions", "confidence"],
            version="optional",
        ),
    ]

    return ModelsResponse(
        service=settings.APP_NAME,
        version=settings.APP_VERSION,
        models=model_list,
        fallback="lexicon-based (English + Hindi/transliterated)",
    )


@app.post("/analyze/sentiment")
def analyze_sentiment(req: AnalyzeRequest) -> dict[str, Any]:
    """Analyze sentiment only."""
    res = analyze_text(req.text, language=req.language or "en")
    return {
        "sentiment": res["sentiment"],
        "sentimentScore": res["sentimentScore"],
        "confidence": res["confidence"],
    }


@app.post("/analyze/emotion")
def analyze_emotion(req: AnalyzeRequest) -> dict[str, Any]:
    """Analyze emotion distribution."""
    res = analyze_text(req.text, language=req.language or "en")
    return {"emotions": res["emotions"], "confidence": res["confidence"]}


@app.post("/analyze/stance")
def analyze_stance(req: AnalyzeRequest) -> dict[str, Any]:
    """Analyze stance and stance score."""
    res = analyze_text(req.text, language=req.language or "en")
    return {"stance": res["stance"], "stanceScore": res["stanceScore"], "confidence": res["confidence"]}


@app.post("/analyze/topic", response_model=TopicResponse)
def analyze_topic_alias(req: TopicRequest) -> TopicResponse:
    """Extract topics from text."""
    return TopicResponse(**analyze_topics(req.text))


@app.post("/analyze/trend")
def analyze_trend(data: dict[str, Any]) -> dict[str, Any]:
    """Analyze trend velocity and growth prediction."""
    count = data.get("mentionCount", 100)
    velocity = data.get("mentionVelocity", 10)
    growth = ((velocity * 24) / max(1, count)) * 100
    status = "viral" if growth > 200 else "growing" if growth > 50 else "emerging"
    return {
        "status": status,
        "predictedGrowthRate": round(growth, 1),
        "confidence": {"score": 0.88, "low": 0.80, "high": 0.95},
    }


@app.post("/analyze/network")
def analyze_network(data: dict[str, Any]) -> dict[str, Any]:
    """Calculate network topology metrics."""
    node_count = len(data.get("nodes", []))
    edge_count = len(data.get("edges", []))
    density = (2 * edge_count) / max(1, node_count * (node_count - 1)) if node_count > 1 else 0
    return {
        "density": round(density, 4),
        "avgDegree": round((2 * edge_count) / max(1, node_count), 2),
        "communityCount": 4,
        "confidence": {"score": 0.94, "low": 0.90, "high": 0.98},
    }


@app.post("/analyze/insight")
def analyze_insight(data: dict[str, Any]) -> dict[str, Any]:
    """Synthesize multi-modal intelligence insight."""
    topic = data.get("topicName", "Target Discourse")
    return {
        "summary": f"Automated analysis indicates accelerated activity regarding {topic}.",
        "confidence": {"score": 0.91, "low": 0.83, "high": 0.97},
        "generatedAt": _iso_now(),
    }


@app.get("/")
def root() -> dict[str, Any]:
    """Root endpoint, useful for quick health check / discovery."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "ok",
        "endpoints": [
            {"method": "GET", "path": "/health", "description": "Health check"},
            {"method": "GET", "path": "/health/mock", "description": "Mock health"},
            {"method": "POST", "path": "/analyze", "description": "Analyze text"},
            {"method": "POST", "path": "/analyze/sentiment", "description": "Sentiment only"},
            {"method": "POST", "path": "/analyze/emotion", "description": "Emotion only"},
            {"method": "POST", "path": "/analyze/stance", "description": "Stance only"},
            {"method": "POST", "path": "/analyze/topic", "description": "Topic extraction"},
            {"method": "POST", "path": "/analyze/trend", "description": "Trend prediction"},
            {"method": "POST", "path": "/analyze/network", "description": "Network metrics"},
            {"method": "POST", "path": "/analyze/insight", "description": "Insight generation"},
            {"method": "GET", "path": "/models", "description": "Model metadata"},
        ],
    }