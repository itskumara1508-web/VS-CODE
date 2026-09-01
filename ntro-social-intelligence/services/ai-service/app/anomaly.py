"""
SOCIOINTELL AI Service - Anomaly & Z-Score Surge Detection Module
Detects statistical surges in mention velocity and sentiment inversions.
"""
from typing import List, Dict, Any
import math

def detect_anomalies(series: List[float], threshold_z: float = 2.5) -> List[Dict[str, Any]]:
    if len(series) < 3:
        return []
        
    mean = sum(series) / len(series)
    variance = sum((x - mean) ** 2 for x in series) / len(series)
    std_dev = math.sqrt(variance) or 1.0
    
    anomalies = []
    for idx, val in enumerate(series):
        z_score = (val - mean) / std_dev
        if abs(z_score) >= threshold_z:
            anomalies.append({
                "index": idx,
                "value": val,
                "zScore": round(z_score, 2),
                "severity": "CRITICAL" if abs(z_score) > 3.5 else "HIGH",
                "type": "SURGE" if z_score > 0 else "PLUMMET",
                "disclaimer": "Observed statistical divergence beyond 2.5σ baseline."
            })
            
    return anomalies
