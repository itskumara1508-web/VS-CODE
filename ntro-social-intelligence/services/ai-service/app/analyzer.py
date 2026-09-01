"""Lexicon-based text analysis for the NTRO AI Service.

Implements sentiment, emotion, stance and sarcasm detection using an
English + basic Hindi/transliterated sentiment lexicon. This is a pure
Python approach so it runs anywhere without heavy ML dependencies.
"""
from __future__ import annotations

import math
import re
from datetime import datetime, timezone
from typing import Any

# ---------------------------------------------------------------------------
# Lexicons
# ---------------------------------------------------------------------------

# Positive English sentiment words -> weight
POSITIVE_WORDS_EN: dict[str, float] = {
    "good": 1.0, "great": 1.4, "excellent": 1.6, "amazing": 1.6, "awesome": 1.5,
    "love": 1.6, "like": 0.8, "loved": 1.5, "support": 1.2, "supports": 1.2,
    "supported": 1.2, "help": 1.0, "helpful": 1.2, "thanks": 1.2, "thank": 1.2,
    "best": 1.5, "better": 1.1, "improve": 1.1, "improved": 1.2, "success": 1.4,
    "successful": 1.4, "win": 1.4, "won": 1.4, "winning": 1.4, "happy": 1.3,
    "glad": 1.2, "joy": 1.4, "joyful": 1.5, "wonderful": 1.6, "bright": 1.2,
    "solid": 1.1, "strong": 1.1, "robust": 1.2, "promising": 1.3, "positive": 1.2,
    "progress": 1.2, "growth": 1.2, "growing": 1.1, "benefit": 1.2, "beneficial": 1.3,
    "advantage": 1.2, "boost": 1.2, "boosted": 1.2, "boosted": 1.2, "increase": 1.1,
    "increased": 1.2, "rising": 1.1, "rise": 1.1, "up": 0.6, "safe": 1.2,
    "secure": 1.2, "innovation": 1.3, "innovative": 1.4, "modern": 1.1,
    "clean": 1.0, "green": 1.0, "efficient": 1.2, "effective": 1.2, "reliable": 1.2,
    "fast": 1.1, "quick": 1.0, "cheap": 1.0, "affordable": 1.2, "quality": 1.2,
    "valuable": 1.3, "excited": 1.3, "exciting": 1.4, "hope": 1.2, "hopeful": 1.3,
    "optimistic": 1.3, "approve": 1.2, "approved": 1.2, "approves": 1.2,
    "endorse": 1.3, "endorsed": 1.3, "recommend": 1.2, "recommended": 1.2,
    "back": 1.0, "backs": 1.3, "backing": 1.2, "agree": 1.1, "agreed": 1.1,
    "agreement": 1.2, "cooperate": 1.1, "collaborate": 1.2, "partnership": 1.3,
    "ally": 1.3, "together": 1.0, "community": 1.0, "unity": 1.3, "peace": 1.3,
    "trust": 1.3, "trusted": 1.3, "confidence": 1.2, "confident": 1.2,
    "accomplished": 1.4, "achieved": 1.4, "achievement": 1.4, "milestone": 1.3,
    "breakthrough": 1.5, "solution": 1.2, "resolve": 1.1, "resolved": 1.1,
}

# Negative English sentiment words -> weight
NEGATIVE_WORDS_EN: dict[str, float] = {
    "bad": -1.0, "terrible": -1.6, "awful": -1.6, "horrible": -1.7, "worst": -1.7,
    "hate": -1.6, "hated": -1.6, "dislike": -1.2, "anger": -1.4, "angry": -1.4,
    "furious": -1.6, "rage": -1.5, "problem": -1.1, "problems": -1.1, "issue": -1.0,
    "issues": -1.0, "fail": -1.4, "failed": -1.4, "failure": -1.5, "lose": -1.3,
    "lost": -1.3, "losing": -1.3, "fight": -1.1, "conflict": -1.2, "war": -1.3,
    "crisis": -1.5, "danger": -1.4, "dangerous": -1.5, "risk": -1.1, "risky": -1.2,
    "threat": -1.3, "threatened": -1.4, "attack": -1.4, "attacked": -1.4,
    "violence": -1.6, "violent": -1.6, "crime": -1.4, "criminal": -1.5,
    "fraud": -1.5, "scam": -1.5, "corrupt": -1.6, "corruption": -1.6,
    "fear": -1.4, "afraid": -1.4, "scared": -1.4, "fearful": -1.3, "anxiety": -1.3,
    "anxious": -1.3, "worry": -1.2, "worried": -1.3, "worrisome": -1.4,
    "sad": -1.3, "sadness": -1.4, "depressed": -1.5, "depressing": -1.5,
    "pain": -1.3, "painful": -1.3, "hurt": -1.3, "hurtful": -1.3, "suffer": -1.4,
    "suffering": -1.5, "broken": -1.3, "break": -1.0, "destroy": -1.5,
    "destroyed": -1.5, "damage": -1.3, "damaged": -1.3, "loss": -1.3,
    "negative": -1.1, "oppose": -1.2, "opposed": -1.2, "opposes": -1.2,
    "against": -1.0, "reject": -1.3, "rejected": -1.3, "rejecting": -1.3,
    "disapprove": -1.3, "disapproved": -1.3, "criticize": -1.2, "criticized": -1.2,
    "criticism": -1.2, "blame": -1.3, "blamed": -1.3, "fault": -1.2, "flaw": -1.1,
    "flawed": -1.2, "useless": -1.4, "worthless": -1.5, "waste": -1.2, "wasted": -1.2,
    "expensive": -1.1, "slow": -1.0, "poor": -1.2, "weak": -1.1, "fragile": -1.2,
    "unreliable": -1.4, "unsafe": -1.4, "insecure": -1.3, "unstable": -1.3,
    "delay": -1.0, "delayed": -1.1, "late": -0.9, "stuck": -1.1, "blocked": -1.2,
    "block": -1.0, "barrier": -1.2, "obstacle": -1.2, "shortage": -1.3,
    "lack": -1.1, "insufficient": -1.3, "inadequate": -1.3, "poorly": -1.2,
}

# Basic Hindi / transliterated sentiment words
POSITIVE_WORDS_HI: dict[str, float] = {
    "achha": 1.2, "achhi": 1.2, "achhe": 1.2, "bahut achha": 1.5, "badiya": 1.3,
    "shaandar": 1.5, "behtareen": 1.6, "kamaal": 1.5, "zabardast": 1.5,
    "pyaar": 1.5, "support": 1.2, "madad": 1.2, "madadgaar": 1.3, "shukriya": 1.3,
    "dhanyavaad": 1.3, "behtar": 1.2, "sudhar": 1.1, "safal": 1.4, "safalta": 1.4,
    "jeet": 1.4, "khushi": 1.4, "aanand": 1.4, "ummeed": 1.3, "vishwas": 1.3,
    "surakshit": 1.3, "mazboot": 1.2, "tez": 1.1, "swachh": 1.0, "hariyali": 1.0,
    "kushal": 1.2, "kushalta": 1.3, "aage": 1.0, "pragati": 1.3, "taraqqi": 1.3,
    "laabh": 1.2, "fayda": 1.2, "faydemand": 1.3, "bahut accha": 1.5,
}

NEGATIVE_WORDS_HI: dict[str, float] = {
    "kharab": -1.2, "bura": -1.2, "buri": -1.2, "ganda": -1.3, "khatarnak": -1.5,
    "dhokha": -1.5, "dhokha": -1.5, "gaali": -1.3, "naraz": -1.3, "gussa": -1.4,
    "gusse": -1.4, "dar": -1.4, "darr": -1.4, "chinta": -1.3, "fikar": -1.2,
    "problem": -1.1, "mushkil": -1.2, "mushkilein": -1.2, "nakami": -1.4,
    "haar": -1.3, "haarna": -1.3, "ladaai": -1.2, "sangharsh": -1.3,
    "khatra": -1.4, "khatre": -1.4, "khoon": -1.5, "hinsa": -1.5,
    "apradh": -1.4, "fraud": -1.5, "bhrashtach": -1.6, "bhrasht": -1.6,
    "jhooth": -1.3, "jhootha": -1.3, "nirash": -1.4, "udasi": -1.4,
    "dukh": -1.3, "dukhi": -1.4, "takleef": -1.4, "dard": -1.3,
    "barbaad": -1.5, "nasht": -1.4, "nuksan": -1.3, "vipatti": -1.4,
    "ke khilaf": -1.0, "asvikar": -1.3, "alaochana": -1.2, "doshi": -1.3,
}

# Negation words that flip sentiment
NEGATIONS = {
    "not", "no", "never", "none", "cannot", "can't", "don't", "dont", "doesn't",
    "doesnt", "didn't", "didnt", "isn't", "isnt", "wasn't", "wasnt", "aren't",
    "arent", "weren't", "werent", "won't", "wont", "wouldn't", "wouldnt",
    "shouldn't", "shouldnt", "couldn't", "couldnt", "without", "nobody",
    "nothing", "neither", "nor", "nahi", "nahin", "na", "kabhi nahi", "bilkul nahi",
}

# Intensifiers / degree modifiers
INTENSIFIERS = {
    "very": 1.3, "really": 1.3, "extremely": 1.5, "absolutely": 1.5, "totally": 1.4,
    "completely": 1.4, "utterly": 1.5, "highly": 1.4, "incredibly": 1.5,
    "unbelievably": 1.5, "so": 1.2, "such": 1.2, "too": 1.2, "quite": 1.15,
    "pretty": 1.1, "fairly": 1.05, "bahut": 1.5, "bohot": 1.5, "kafi": 1.2,
    "kaafi": 1.2, "zyada": 1.3, "zyaada": 1.3, "at": 1.0, "bohut": 1.5,
}

# Diminishers
DIMINISHERS = {
    "slightly": 0.5, "somewhat": 0.5, "a little": 0.4, "a bit": 0.4, "kind of": 0.5,
    "sort of": 0.5, "mildly": 0.5, "barely": 0.3, "hardly": 0.3, "thoda": 0.4,
    "thodi": 0.4, "kuch": 0.5,
}

# ---------------------------------------------------------------------------
# Emotion triggers
# ---------------------------------------------------------------------------

EMOTION_WORD_MAP: dict[str, dict[str, float]] = {
    "joy": {"happy": 1.0, "joy": 1.0, "joyful": 1.0, "glad": 0.9, "delight": 1.0,
            "celebrate": 1.0, "celebration": 1.0, "wonderful": 0.8, "amazing": 0.8,
            "great": 0.7, "excellent": 0.8, "khushi": 1.0, "aanand": 1.0, "achha": 0.7},
    "anger": {"angry": 1.0, "anger": 1.0, "furious": 1.0, "rage": 1.0, "mad": 0.8,
              "frustrated": 0.9, "frustrating": 0.9, "outrage": 1.0, "outraged": 1.0,
              "gussa": 1.0, "naraz": 0.9, "gusse": 1.0},
    "fear": {"fear": 1.0, "afraid": 1.0, "scared": 1.0, "terrified": 1.0, "panic": 1.0,
             "frightened": 1.0, "dread": 1.0, "alarm": 0.8, "dar": 1.0, "darr": 1.0,
             "khatra": 0.9, "khauf": 1.0},
    "sadness": {"sad": 1.0, "sadness": 1.0, "depressed": 1.0, "depressing": 1.0,
                "cry": 0.9, "crying": 0.9, "tears": 0.9, "grief": 1.0, "mourning": 1.0,
                "pain": 0.7, "heartbreak": 1.0, "dukh": 1.0, "dukhi": 1.0, "udasi": 1.0},
    "surprise": {"surprised": 1.0, "surprise": 1.0, "shocking": 1.0, "shock": 1.0,
                 "astonished": 1.0, "amazed": 1.0, "wow": 0.9, "unexpected": 0.9,
                 "startling": 1.0, "unbelievable": 0.9},
    "excitement": {"excited": 1.0, "exciting": 1.0, "thrilled": 1.0, "enthusiastic": 1.0,
                   "energized": 1.0, "eager": 0.9, "anticipating": 0.9, "pumped": 0.9,
                   "hyped": 0.9, "hype": 0.8, "josh": 0.9},
    "anxiety": {"anxiety": 1.0, "anxious": 1.0, "worried": 1.0, "worry": 1.0,
                "nervous": 1.0, "concerned": 0.8, "stress": 1.0, "stressed": 1.0,
                "tension": 0.9, "uneasy": 0.9, "chinta": 1.0, "fikar": 0.9},
    "supportive": {"support": 1.0, "supports": 1.0, "supported": 1.0, "help": 0.9,
                   "helpful": 0.9, "back": 0.8, "backing": 0.9, "endorse": 1.0,
                   "endorsed": 1.0, "agree": 0.9, "agreed": 0.9, "solidarity": 1.0,
                   "advocate": 0.9, "madad": 1.0, "madadgaar": 1.0},
    "hostile": {"hostile": 1.0, "aggressive": 1.0, "attack": 0.9, "attacking": 0.9,
                "threaten": 0.9, "threat": 0.8, "violence": 1.0, "violent": 1.0,
                "abuse": 1.0, "abusive": 1.0, "hate": 0.9, "hatred": 1.0,
                "oppose": 0.8, "against": 0.6, "hinsa": 1.0, "khoon": 0.9},
    "neutral": {"neutral": 0.5, "standard": 0.3, "normal": 0.3, "mediocre": 0.4,
                "average": 0.3, "typical": 0.3, "fine": 0.3, "okay": 0.3},
}

# Hindi/transliterated positive/negative hint words for stance
SUPPORT_HINTS = {
    "support", "supports", "back", "backs", "endorse", "endorsed", "agree",
    "agreed", "recommend", "recommended", "approve", "approved", "yes", "yes!",
    "good", "great", "excellent", "promote", "promoting", "boost", "boosting",
    "achha", "badiya", "shaandar", "support karta", "madad", "favourable",
    "favor", "favorable", "in favour", "in favor", "hmm", "mhan", "han", "haan",
    "theek", "sahi", "sach", "vishwas", "ummeed", "pro", "safar",
}

AGAINST_HINTS = {
    "against", "oppose", "opposed", "opposes", "reject", "rejected",
    "rejecting", "disapprove", "disapproved", "criticize", "criticized",
    "criticism", "no", "no!", "bad", "terrible", "awful", "worst", "hate",
    "protest", "protests", "boycott", "block", "blocks", "ban", "banned",
    "stop", "stopping", "kharab", "bura", "buri", "na", "nahi", "nahin",
    "ke khilaf", "asvikar", "alaochana", "doshi", "dhokha", "scam", "fraud",
    "against", "anti", "negative", "fail", "failed", "danger", "dangerous",
    "risk", "risky", "threat", "threatened", "warn", "warns",
}

# ---------------------------------------------------------------------------
# Tokenization / normalization helpers
# ---------------------------------------------------------------------------

_TOKEN_RE = re.compile(r"[a-z0-9'@#\-\u0900-\u097F]+", re.IGNORECASE)

# Common English + Hindi stopwords to omit during keyword extraction
STOPWORDS = {
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
    "who", "whom", "whose", "am", "been", "being", "made", "make", "make",
    "ka", "ki", "ke", "ko", "se", "me", "par", "aur", "bhi", "hai", "hain",
    "ho", "tha", "thi", "the", "hoon", "hum", "aap", "tum", "yeh", "woh",
    "wo", "is", "us", "in", "unki", "unka", "apna", "mera", "tera", "apni",
    "kuch", "sab", "bahut", "bohot", "kafi", "kaafi", "zyada", "lekin",
    "magar", "parantu", "kyunki", "kya", "kaise", "kab", "kahan", "kis",
    "kisse", "inhone", "unhone", "maine", "tumne", "usne", "inhon", "unhon",
}

# ---------------------------------------------------------------------------
# Core analysis
# ---------------------------------------------------------------------------


def _normalize(text: str) -> str:
    """Lowercase and collapse whitespace."""
    return " ".join(text.lower().split())


def _tokenize(text: str) -> list[str]:
    """Tokenize text into words, preserving accents/hangul-free tokens."""
    return _TOKEN_RE.findall(_normalize(text))


def _word_intensity(word: str, tokens: list[str], index: int) -> float:
    """Calculate the nearest modifier intensity before a sentiment word."""
    intensity = 1.0
    window = max(0, index - 3)
    context = tokens[window:index]
    # Search backward for intensifier / diminisher applied to this word
    for tok in reversed(context):
        if tok in INTENSIFIERS:
            intensity *= INTENSIFIERS[tok]
            break
        if tok in DIMINISHERS:
            intensity *= DIMINISHERS[tok]
            break
    return intensity


def _is_negated(tokens: list[str], index: int) -> bool:
    """Check if a sentiment word at index is negated by a nearby negation."""
    window = tokens[max(0, index - 3): index]
    for tok in window:
        if tok in NEGATIONS:
            return True
    return False


def _emotion_sum(emotions: dict[str, float]) -> float:
    return sum(emotions.values())


def _sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-x))


def analyze_text(text: str, language: str = "en") -> dict[str, Any]:
    """Run the full lexicon-based analysis and return a normalized result."""
    if not text or not text.strip():
        return _empty_result()

    tokens = _tokenize(text)
    if not tokens:
        return _empty_result()

    positive_hits: list[tuple[str, float, bool]] = []
    negative_hits: list[tuple[str, float, bool]] = []

    pos_score = 0.0
    neg_score = 0.0

    # Track emotion raw counts
    emotion_raw: dict[str, float] = {
        "joy": 0.0, "anger": 0.0, "fear": 0.0, "sadness": 0.0,
        "surprise": 0.0, "excitement": 0.0, "anxiety": 0.0,
        "supportive": 0.0, "hostile": 0.0, "neutral": 0.0,
    }

    for idx, token in enumerate(tokens):
        # Search both lexicons
        w_en = POSITIVE_WORDS_EN.get(token, 0.0)
        w_hi = POSITIVE_WORDS_HI.get(token, 0.0)
        w_pos = max(w_en, w_hi)

        n_en = NEGATIVE_WORDS_EN.get(token, 0.0)
        n_hi = NEGATIVE_WORDS_HI.get(token, 0.0)
        # Use whichever negative lexicon has a match for this token
        w_neg = n_en if n_en != 0.0 else n_hi

        # Track whether token is a positive or negative sentiment word
        is_positive = w_pos > 0
        is_negative = w_neg < 0

        if is_positive or is_negative:
            intensity = _word_intensity(token, tokens, idx)
            negated = _is_negated(tokens, idx)

            if is_positive:
                weight = w_pos * intensity
                positive_hits.append((token, weight, negated))
                if not negated:
                    pos_score += weight
                else:
                    # Negated positive effectively negative
                    neg_score += weight
            if is_negative:
                weight = abs(w_neg) * intensity
                negative_hits.append((token, weight, negated))
                if not negated:
                    neg_score += weight
                else:
                    # Negated negative effectively positive
                    pos_score += weight

        # Emotion mapping (ignore negation nuance for simplicity)
        for emotion, triggers in EMOTION_WORD_MAP.items():
            if token in triggers:
                emotion_raw[emotion] += triggers[token]

    total = pos_score + neg_score

    # Sentiment classification
    if total == 0:
        sentiment = "neutral"
        sentiment_score = 0.0
    else:
        # Normalized score between -1 and 1
        raw_score = (pos_score - neg_score) / total if total > 0 else 0.0
        # Apply a small squash to prevent extreme scores on short text
        sentiment_score = max(-1.0, min(1.0, raw_score))
        if sentiment_score > 0.15:
            sentiment = "positive"
        elif sentiment_score < -0.15:
            sentiment = "negative"
        else:
            sentiment = "neutral"

    # Stance estimation
    stance, stance_score = _estimate_stance(tokens, sentiment, sentiment_score)

    # Sarcasm probability: higher when negation + positive words coexist
    sarcasm_prob = _estimate_sarcasm(positive_hits, negative_hits, tokens, sentiment)

    # Emotion distribution (normalize to sum 1)
    emotions = _normalize_emotions(emotion_raw, sentiment)

    # Confidence heuristic
    confidence = _estimate_confidence(total, len(tokens), sentiment, stance)

    return {
        "sentiment": sentiment,
        "sentimentScore": round(sentiment_score, 4),
        "emotions": {k: round(v, 4) for k, v in emotions.items()},
        "stance": stance,
        "stanceScore": round(stance_score, 4),
        "sarcasmProbability": round(sarcasm_prob, 4),
        "confidence": {
            "score": round(confidence[0], 4),
            "low": round(confidence[1], 4),
            "high": round(confidence[2], 4),
        },
        "analyzedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }


def _empty_result() -> dict[str, Any]:
    return {
        "sentiment": "neutral",
        "sentimentScore": 0.0,
        "emotions": {
            "joy": 0.0, "anger": 0.0, "fear": 0.0, "sadness": 0.0,
            "surprise": 0.0, "excitement": 0.0, "anxiety": 0.0,
            "supportive": 0.0, "hostile": 0.0, "neutral": 1.0,
        },
        "stance": "neutral",
        "stanceScore": 0.0,
        "sarcasmProbability": 0.0,
        "confidence": {
            "score": 0.5,
            "low": 0.5,
            "high": 0.5,
        },
        "analyzedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }


def _estimate_stance(
    tokens: list[str],
    sentiment: str,
    sentiment_score: float,
) -> tuple[str, float]:
    """Derive a stance score from sentiment and explicit stance hints."""
    support_count = sum(1 for t in tokens if t in SUPPORT_HINTS)
    against_count = sum(1 for t in tokens if t in AGAINST_HINTS)

    stance_bias = (support_count - against_count) / max(1, support_count + against_count)

    # Blend with sentiment score
    combined = 0.6 * sentiment_score + 0.4 * stance_bias
    combined = max(-1.0, min(1.0, combined))

    if combined > 0.15:
        return "support", combined
    if combined < -0.15:
        return "against", combined
    return "neutral", combined


def _estimate_sarcasm(
    positive_hits: list[tuple[str, float, bool]],
    negative_hits: list[tuple[str, float, bool]],
    tokens: list[str],
    sentiment: str,
) -> float:
    """Estimate sarcasm probability based on negated-positive words."""
    negated_positives = sum(1 for _, _, negated in positive_hits if negated)
    negation_count = sum(1 for t in tokens if t in NEGATIONS)
    excitement_markers = sum(1 for t in tokens if t in {"!", "wow", "really", "sure"})

    if sentiment == "neutral":
        return 0.05

    if negated_positives > 0 and negation_count > 0:
        base = min(0.95, 0.45 + 0.15 * negated_positives + 0.08 * negation_count)
    else:
        base = 0.1

    # Add small bump if punctuation like "!" present
    if sentiment != "neutral" and excitement_markers > 0:
        base = min(0.95, base + 0.05 * excitement_markers)

    return max(0.0, min(0.95, base))


def _normalize_emotions(
    emotion_raw: dict[str, float],
    sentiment: str,
) -> dict[str, float]:
    """Normalize emotion raw weights into a distribution summing to 1."""
    total = _emotion_sum(emotion_raw)

    if total <= 0:
        # No explicit emotion words detected; assign based on sentiment
        if sentiment == "positive":
            emotion_raw["joy"] = 0.4
            emotion_raw["excitement"] = 0.3
            emotion_raw["supportive"] = 0.3
        elif sentiment == "negative":
            emotion_raw["anger"] = 0.3
            emotion_raw["sadness"] = 0.3
            emotion_raw["fear"] = 0.2
            emotion_raw["anxiety"] = 0.2
        else:
            emotion_raw["neutral"] = 1.0
        total = _emotion_sum(emotion_raw)

    # Guarantee a slight baseline for neutral
    if "neutral" in emotion_raw and total == 0:
        emotion_raw["neutral"] = 1.0
        total = 1.0

    return {k: (v / total) if total > 0 else 0.0 for k, v in emotion_raw.items()}


def _estimate_confidence(
    total: float,
    token_count: int,
    sentiment: str,
    stance: str,
) -> tuple[float, float, float]:
    """Estimate a confidence based on signal strength and text length."""
    # More signed words -> more confident
    signal_strength = min(1.0, abs(total) / 3.0)
    length_factor = min(1.0, token_count / 20.0)
    stance_factor = 0.7 if stance != "neutral" else 0.4

    score = 0.5 + 0.3 * signal_strength + 0.1 * length_factor
    score = max(0.5, min(0.95, score))

    low = max(0.5, score - 0.1)
    high = min(0.95, score + 0.1)

    return score, low, high
