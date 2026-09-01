"""Pydantic request/response schemas for the NTRO AI Service."""
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    """Incoming text to analyze."""

    text: str = Field(..., min_length=1)
    language: Optional[str] = Field(default="en")


class AnalyzeBatchRequest(BaseModel):
    """Incoming list of texts to analyze."""

    texts: List[str] = Field(..., min_length=1)


class Confidence(BaseModel):
    """Confidence bounds for an analysis result."""

    score: float
    low: float
    high: float


class AnalysisResult(BaseModel):
    """Sentiment / emotion / stance analysis output."""

    sentiment: str
    sentimentScore: float
    emotions: Dict[str, float]
    stance: str
    stanceScore: float
    sarcasmProbability: float
    confidence: Confidence
    analyzedAt: str


class TopicItem(BaseModel):
    """A detected topic."""

    name: str
    aliases: List[str]
    category: str


class TopicRequest(BaseModel):
    """Incoming text for topic extraction."""

    text: str = Field(..., min_length=1)


class TopicResponse(BaseModel):
    """Extracted topics and keywords from a text."""

    topics: List[TopicItem]
    keywords: List[str]


class HealthResponse(BaseModel):
    """Health check response."""

    service: str
    status: str
    version: str
    timestamp: str


class HealthMockResponse(BaseModel):
    """Simple mock health response."""

    service: str = "ntro-ai-service"
    status: str = "ok"


class ModelInfo(BaseModel):
    """Metadata describing a single analysis model."""

    id: str
    name: str
    type: str
    enabled: bool
    description: str
    output: List[str]
    version: str


class ModelsResponse(BaseModel):
    """Metadata describing the analysis backend."""

    service: str
    version: str
    models: List[ModelInfo]
    fallback: str = "lexicon-based (English + Hindi/transliterated)"
