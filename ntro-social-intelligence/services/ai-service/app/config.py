"""Configuration for the NTRO AI Service."""
import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Runtime settings loaded from environment variables."""

    def __init__(self) -> None:
        self.APP_NAME: str = "ntro-ai-service"
        self.APP_VERSION: str = "1.0.0"
        self.host: str = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
        self.port: int = int(os.getenv("AI_SERVICE_PORT", "5001"))
        # Backwards-compatible aliases
        self.service_name = self.APP_NAME
        self.version = self.APP_VERSION
        # Optional HuggingFace model identifiers (empty => lexicon-based only).
        self.hf_sentiment_model: str = os.getenv("HF_SENTIMENT_MODEL", "")
        self.hf_emotion_model: str = os.getenv("HF_EMOTION_MODEL", "")


settings = Settings()