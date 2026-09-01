"""
SOCIOINTELL AI Service - Trend Detection & Velocity Module
Categorizes trends into Rising Now, Viral, Emerging, Declining, and Predicted Next.
"""
from typing import List, Dict, Any

def classify_trend(mention_count: int, growth_rate_pct: float, velocity_per_hr: int) -> str:
    if growth_rate_pct > 200 or velocity_per_hr > 500:
        return "viral"
    elif growth_rate_pct > 80:
        return "emerging"
    elif growth_rate_pct > 25:
        return "growing"
    elif growth_rate_pct < -15:
        return "declining"
    else:
        return "stable"

def compute_trend_metrics(trends: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    enriched = []
    for t in trends:
        status = classify_trend(t.get("mentionCount", 100), t.get("growthRate", 10), t.get("velocity", 50))
        predicted_growth = round(t.get("growthRate", 10) * 1.15, 1) if status in ["viral", "emerging"] else round(t.get("growthRate", 0) * 0.85, 1)
        
        enriched.append({
            **t,
            "status": status,
            "predictedGrowthPct": predicted_growth,
            "isAnomaly": status == "viral" and t.get("growthRate", 0) > 300,
            "aiConfidence": 0.94 if status == "viral" else 0.88,
        })
    return enriched
