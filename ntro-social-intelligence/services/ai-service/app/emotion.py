"""
SOCIOINTELL AI Service - Emotion Taxonomy Module
Nuanced Emotion Detection: joy, anger, fear, anxiety, excitement, supportive, hostile, frustration, concern, urgency
"""
from typing import Dict

EMOTION_KEYWORDS = {
    "joy": ["happy", "delighted", "glad", "kush", "anand", "proud", "smiling", "celebrate"],
    "anger": ["angry", "furious", "rage", "gussa", "disgusted", "annoyed", "outrage"],
    "fear": ["scared", "fear", "darr", "afraid", "panic", "threat", "danger", "terror"],
    "anxiety": ["worried", "nervous", "chinta", "stress", "tense", "uncertain", "doubt"],
    "excitement": ["excited", "thrilled", "utsahit", "pumped", "cant wait", "eager"],
    "supportive": ["support", "stand with", "agree", "samarthan", "kudos", "solidarity"],
    "hostile": ["enemy", "attack", "boycott", "ban", "shame", "dushman", "expose"],
    "frustration": ["frustrated", "tired of", "fed up", "pareshan", "annoying", "delay"],
    "concern": ["concerned", "heed", "attention", "careful", "safety", "risk"],
    "urgency": ["urgent", "immediately", "jaldi", "now", "critical", "sos", "alert"]
}

def analyze_emotions(text: str) -> Dict[str, float]:
    text_lower = text.lower()
    raw_scores = {}
    
    for emotion, keywords in EMOTION_KEYWORDS.items():
        count = sum(1 for kw in keywords if kw in text_lower)
        raw_scores[emotion] = count * 1.5
        
    total = sum(raw_scores.values())
    if total == 0:
        return {k: 0.10 for k in EMOTION_KEYWORDS.keys()}
        
    normalized = {k: round(v / total, 3) for k, v in raw_scores.items()}
    return normalized
