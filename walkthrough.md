# Technical Catchup: Optimized Agentic Extraction Process

This document explains the mechanism behind the PAS (Policy Administration System) extraction pipeline, optimized for performance, reliability, and reduced terminal noise.

## 1. Document Ingestion & Text Extraction
- **Input**: PDF document buffer.
- **Processing**: The system uses `pdf-parse` to extract raw text.
- **Cleaning**: Special characters (like null bytes) are stripped to ensure clean input for the LLM.

## 2. Semantic Chunking with Overlap
To maintain context between chunks, we use a custom semantic chunking strategy:
- **Chunk Size**: Approximately 1500 characters.
- **Overlap**: The last 2 paragraphs of each chunk are repeated in the next chunk.
- **Benefit**: Ensures that sentences or context split across pages are still retrievable by the agents.

## 3. Vector Store & Rate-Limited Embeddings
- **Storage**: Chunks are stored in Supabase with pgvector.
- **Optimization**: Embedding generation is now rate-limited (5 concurrent requests) to prevent hitting Gemini API limits.
- **Retrieval**: Agents use cosine similarity to find the most relevant chunks for their specific extraction task.

## 4. Clustered Agent Orchestration
Instead of running all 11 agents in parallel, which can overwhelm the API and the terminal, we use a clustered approach:
- **Cluster Size**: 3 agents at a time.
- **Execution**: The orchestrator waits for one cluster to finish before starting the next.
- **Consolidation**: Results from all agents are deep-merged into a single structured JSON object following the `DEFINITIVE_PAS_SCHEMA`.

## 5. Optimized Logging
- **Utility**: A new [Logger](file:///f:/primepolicy-ai-main/primepolicy-ai-main/lib/utils.ts#15-42) class handles terminal output.
- **Levels**: Supports `DEBUG`, `INFO`, `WARN`, and `ERROR`.
- **Default Behavior**: Only `INFO` and above are shown in the terminal by default, significantly reducing noise. `DEBUG` logs can be enabled via environment variables for troubleshooting.

## 6. Error Handling & Retries
- **Mechanism**: Exponential backoff is implemented for Gemini API calls.
- **Robustness**: The system distinguishes between transient (429, 503) and permanent errors.
