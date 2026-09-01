# NTRO AI/NLP Architecture & Machine Learning Pipelines

## 1. Natural Language Processing Pipeline

The platform uses a modular dual-engine design:
1. **Lightweight Lexicon & Heuristic Engine (Default)**:
   - High-throughput pure-Python pipeline.
   - Multi-lingual sentiment lexicon covering English, Hindi, and transliterated Indic scripts.
   - Normalizes text into a 10-emotion probability vector:
     `{joy, anger, fear, sadness, surprise, excitement, anxiety, supportive, hostile, neutral}`
   - Heuristic stance detection blending keyword signals with polarity.
   - Sarcasm probability estimator based on intensifier-negation inversions.

2. **Transformer & Deep Learning Integration (Optional / Scalable)**:
   - Hugging Face `cardiffnlp/twitter-roberta-base-sentiment-latest` for zero-shot sentiment inference.
   - `sentence-transformers/all-MiniLM-L6-v2` for semantic topic embedding and narrative clustering.
   - BERTopic for dynamic topic discovery.

## 2. Graph & Topology Analytics

- **PageRank**: Measures authoritative amplifier nodes.
- **Betweenness Centrality**: Identifies information bridge accounts connecting separate communities.
- **Degree Centrality**: Quantifies direct conversational reach.
- **Louvain Modularity Partitioning**: Automatically discovers sub-communities discussing national topics.

## 3. Grounded AI Analyst (Fact-Verified QA)

- Synthesizes timeline, sentiment delta, and link graph facts before producing answers.
- Automatically supplies confidence score bounds (`low`, `score`, `high`) and supporting evidence chips.

