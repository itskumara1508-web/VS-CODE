"""Rule-based keyword and topic extraction for the NTRO AI Service.

Replicates the TOPICS list from @ntro/shared/src/constants.ts locally in
Python, since Python cannot import from TypeScript packages. Topics and
keyword extraction are done with simple string matching and scoring.
"""
from __future__ import annotations

import re
from typing import Any


# ---------------------------------------------------------------------------
# Replicated TOPICS list (source: @ntro/shared/src/constants.ts)
# ---------------------------------------------------------------------------

# Each topic: {name, aliases[], category, description}
TOPICS: list[dict[str, Any]] = [
    {
        "name": "Law & Order",
        "aliases": ["law", "law and order", "police", "crime", "justice",
                    "court", "legal", "laws", "crimes", "policing", "enforcement"],
        "category": "Governance",
        "description": "Crime, policing, judiciary and public safety issues",
    },
    {
        "name": "Corruption",
        "aliases": ["corruption", "bribery", "bribe", "scam", "scams",
                    "embezzlement", "nepotism", "black money", "hawala", "grabbing"],
        "category": "Governance",
        "description": "Government and institutional corruption allegations",
    },
    {
        "name": "Economy",
        "aliases": ["economy", "economic", "gdp", "inflation", "rupee", "prices",
                    "market", "markets", "stock", "trade", "business", "jobs",
                    "employment", "jobless", "exports", "imports", "growth"],
        "category": "Economy",
        "description": "Macroeconomic trends, markets, jobs and trade",
    },
    {
        "name": "Infrastructure",
        "aliases": ["infrastructure", "roads", "highway", "highways", "railway",
                    "railways", "metro", "airport", "bridges", "power",
                    "electricity", "water", "housing", "construction"],
        "category": "Development",
        "description": "Physical infrastructure and connectivity projects",
    },
    {
        "name": "Health",
        "aliases": ["health", "healthcare", "hospital", "hospitals", "doctor",
                    "doctors", "vaccine", "vaccines", "disease", "diseases",
                    "pandemic", "covid", "medical", "medicine", "patient"],
        "category": "Public Services",
        "description": "Public health, healthcare access and disease outbreaks",
    },
    {
        "name": "Education",
        "aliases": ["education", "school", "schools", "college", "colleges",
                    "university", "students", "teacher", "teachers", "exam",
                    "exams", "curriculum", "literacy", "admissions"],
        "category": "Public Services",
        "description": "Educational institutions, policy and outcomes",
    },
    {
        "name": "Agriculture",
        "aliases": ["agriculture", "farmer", "farmers", "farming", "crop", "crops",
                    "monsoon", "harvest", "mandi", "fertilizer", "irrigation",
                    "kisan", "paddy", "wheat", "sugarcane"],
        "category": "Economy",
        "description": "Farming, crop yields, farm policy and farmer welfare",
    },
    {
        "name": "Defence & Security",
        "aliases": ["defence", "defense", "army", "military", "border", "borders",
                    "security", "national security", "soldiers", "missile",
                    "terror", "terrorism", "encounter", "drone", "insurgency"],
        "category": "Security",
        "description": "National defence, armed forces and border security",
    },
    {
        "name": "Environment",
        "aliases": ["environment", "climate", "pollution", "air quality", "water",
                    "forest", "forests", "wildlife", "green", "sustainable",
                    "emission", "emissions", "waste", "renewable"],
        "category": "Sustainability",
        "description": "Climate change, pollution and environmental policy",
    },
    {
        "name": "Technology",
        "aliases": ["technology", "tech", "digital", "startup", "startups",
                    "software", "cyber", "cybersecurity", "internet", "data",
                    "artificial intelligence", "ai", "5g", "semiconductor",
                    "chip", "chips", "smartphone", "smartphones"],
        "category": "Innovation",
        "description": "Emerging technology, digital transformation and startups",
    },
]


# ---------------------------------------------------------------------------
# Helper structures
# ---------------------------------------------------------------------------

# Build lookup: lowercase alias/topic name -> canonical topic
_ALIAS_TO_TOPIC: dict[str, dict[str, Any]] = {}
for _topic in TOPICS:
    _key = _topic["name"].lower()
    _ALIAS_TO_TOPIC[_key] = _topic
    for _alias in _topic["aliases"]:
        _ALIAS_TO_TOPIC[_alias.lower()] = _topic

# Multi-word phrases that should be matched as whole entities
_MULTI_WORD_TOPICS = {
    _name.lower(): _name for _name in [t["name"] for t in TOPICS]
}

# Additional generic keywords that are not topic aliases but useful signal words
GENERIC_KEYWORDS = {
    "government", "ministry", "minister", "policy", "scheme", "budget",
    "bill", "act", "parliament", "assembly", "election", "elections",
    "vote", "voting", "march", "rally", "protest", "protesters",
    "demonstration", "strike", "union", "committee", "commission",
    "district", "state", "nation", "country", "administration",
    "officials", "bureaucracy", "reform", "reforms", "transparency",
    "accountability", "grievance", "grievances", "complaint", "complaints",
}

# Words to exclude from keywords (stopwords, common non-signal words)
_KEYWORD_EXCLUSIONS = {
    "the", "a", "an", "and", "but", "or", "for", "nor", "on", "at", "to",
    "by", "of", "in", "with", "is", "are", "was", "were", "be", "been",
    "being", "it", "its", "this", "that", "these", "those", "i", "me", "my",
    "we", "our", "you", "your", "he", "she", "him", "her", "they", "them",
    "their", "not", "no", "yes", "do", "does", "did", "have", "has", "had",
    "will", "would", "shall", "should", "can", "could", "may", "might", "must",
    "from", "up", "down", "out", "over", "under", "again", "further", "then",
    "once", "here", "there", "when", "where", "why", "how", "all", "any",
    "both", "each", "few", "more", "most", "other", "some", "such", "only",
    "own", "same", "so", "than", "too", "very", "just", "about", "into",
    "through", "during", "before", "after", "above", "below", "between",
    "because", "while", "if", "as", "until", "unless", "what", "which",
    "who", "whom", "whose", "am", "been", "being", "made", "make",
    "ka", "ki", "ke", "ko", "se", "me", "par", "aur", "bhi", "hai", "hain",
    "ho", "tha", "thi", "hoon", "hum", "aap", "tum", "yeh", "woh", "wo",
    "is", "us", "in", "unki", "unka", "apna", "mera", "tera", "apni",
    "kuch", "sab", "bahut", "bohot", "kafi", "kaafi", "zyada", "lekin",
    "magar", "parantu", "kyunki", "kya", "kaise", "kab", "kahan", "kis",
    "kisse", "inhone", "unhone", "maine", "tumne", "usne", "inhon", "unhon",
}


# ---------------------------------------------------------------------------
# Extraction functions
# ---------------------------------------------------------------------------

def _clean_text(text: str) -> str:
    """Lowercase and normalize whitespace for matching."""
    return " ".join(text.lower().split())


def _tokenize(text: str) -> list[str]:
    """Tokenize text into lowercase alpha tokens."""
    return re.findall(r"[a-z0-9\u0900-\u097F]+", _clean_text(text))


def _score_keyword(token: str, text: str) -> float:
    """Score how significant a keyword is based on frequency and length."""
    frequency = text.count(token)
    # Reward longer words and frequent mentions
    length_factor = min(1.0, len(token) / 10.0)
    return 0.3 * frequency + 0.7 * length_factor


def extract_topics(text: str) -> list[dict[str, Any]]:
    """Extract matched topics from text based on alias/name matching."""
    clean = _clean_text(text)
    matched: dict[str, dict[str, Any]] = {}

    # 1. Match multi-word topic names (e.g. "law and order", "defence & security")
    for phrase, name in _MULTI_WORD_TOPICS.items():
        if phrase in clean:
            topic = _ALIAS_TO_TOPIC.get(phrase)
            if topic:
                matched[name] = _format_topic(topic, count=clean.count(phrase))

    # 2. Match aliases
    for alias, topic in _ALIAS_TO_TOPIC.items():
        if alias in clean and topic["name"] not in matched:
            count = clean.count(alias)
            matched[topic["name"]] = _format_topic(topic, count=count)

    # 3. Match individual words from names (e.g. "economy", "health")
    for topic in TOPICS:
        name_words = _topic_name_words(topic["name"])
        if topic["name"] not in matched:
            min_hits = 1 if len(name_words) <= 2 else 2
            hits = sum(1 for w in name_words if w in clean)
            if hits >= min_hits:
                matched[topic["name"]] = _format_topic(topic, count=hits)

    # Sort by match frequency then name
    return sorted(matched.values(), key=lambda t: (-t["_count"], t["name"]))


def _format_topic(topic: dict[str, Any], count: int) -> dict[str, Any]:
    """Format a topic into the API response shape, keeping internal count."""
    return {
        "name": topic["name"],
        "aliases": list(topic["aliases"]),
        "category": topic["category"],
        "_count": count,
        "description": topic.get("description", ""),
    }


def _topic_name_words(name: str) -> list[str]:
    """Split a topic name into meaningful words."""
    return [w for w in name.lower().split() if w not in {"&", "and", "the"}]


def extract_keywords(text: str, max_keywords: int = 15) -> list[str]:
    """Extract the top distinct keywords from text using frequencies."""
    clean = _clean_text(text)
    tokens = _tokenize(clean)

    freq: dict[str, int] = {}
    for token in tokens:
        if token in _KEYWORD_EXCLUSIONS or len(token) < 3:
            continue
        freq[token] = freq.get(token, 0) + 1

    # Score each keyword
    scored = [
        (token, _score_keyword(token, clean))
        for token in freq
        if _is_probable_keyword(token)
    ]

    scored.sort(key=lambda x: (-x[1], x[0]))
    return [token for token, _ in scored[:max_keywords]]


def _is_probable_keyword(token: str) -> bool:
    """Heuristic: filter out very short or pure numbers."""
    if len(token) < 3:
        return False
    if token.isdigit():
        return False
    return True


def analyze_topics(text: str) -> dict[str, Any]:
    """Primary entrypoint: extract topics and keywords from a text."""
    topics = extract_topics(text)
    keywords = extract_keywords(text)

    # Strip the internal _count and description from topics for the API
    public_topics = [
        {"name": t["name"], "aliases": t["aliases"], "category": t["category"]}
        for t in topics
    ]

    return {
        "topics": public_topics,
        "keywords": keywords,
    }