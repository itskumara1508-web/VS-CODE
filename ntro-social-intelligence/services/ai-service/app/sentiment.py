"""
SOCIOINTELL AI Service - Sentiment Module
Hybrid Rule-Based + Lexicon Multi-Lingual Sentiment Analysis (English, Hindi, Hinglish)
"""
from typing import Dict, Any

POSITIVE_WORDS = {
    "great", "good", "excellent", "awesome", "amazing", "love", "best", "positive", "progress",
    "success", "win", "innovative", "effective", "clean", "reliable", "badiya", "shandar", "badhiya",
    "accha", "sahi", "kamaal", "zabardast", "shukriya", "proud", "congratulations", "support"
}

NEGATIVE_WORDS = {
    "bad", "terrible", "horrible", "worst", "fail", "failure", "crisis", "hate", "angry",
    "scam", "corrupt", "outage", "broken", "danger", "threat", "bekaar", "kharab", "ganda",
    "chori", "dhokha", "ghotala", "fraud", "slow", "pathetic", "blackout", "collapse", "issue"
}

def analyze_sentiment(text: str) -> Dict[str, Any]:
    text_lower = text.lower()
    words = text_lower.split()
    
    pos_count = sum(1 for w in words if any(pw in w for pw in POSITIVE_WORDS))
    neg_count = sum(1 for w in words if any(nw in w for nw in NEGATIVE_WORDS))
    
    total = pos_count + neg_count
    if total == 0:
        score = 0.0
        sentiment = "neutral"
        confidence = 0.75
    else:
        score = (pos_count - neg_count) / max(total, 1)
        score = max(-1.0, min(1.0, score))
        if score > 0.15:
            sentiment = "positive"
        elif score < -0.15:
            sentiment = "negative"
        else:
            sentiment = "neutral"
        confidence = min(0.98, 0.70 + (total * 0.05))
        
    return {
        "sentiment": sentiment,
        "score": round(score, 3),
        "confidence": round(confidence, 3),
        "positive_signals": pos_count,
        "negative_signals": neg_count,
    }
