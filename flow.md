# Flow of the PrimePolicy AI System

This document outlines the complete flow of the document extraction pipeline, from the moment a PDF is uploaded to the final JSON output.

### START
The process begins when a user uploads a PDF document to the system for analysis. The document contains complex policy information that needs to be broken down and structured.

---

### PHASE 1: Document Ingestion & Preparation
This phase focuses on reading the PDF and converting it into a searchable format.

* **PDF Parsing**: The `AgentOrchestrator` receives the PDF file (buffer and file name) and uses the `pdf-parse` library to extract raw text from it.
* **Cleaning Data**: Unnecessary null characters are removed to prepare a clean text string. `clearDocumentSections` in `vector-store.ts` removes old records.
* **Semantic Chunking**: The orchestrator's `semanticChunk()` method breaks the massive text into smaller readable pieces (chunks) of about 3000 characters. It keeps an overlap of a couple paragraphs to ensure no context is lost between splits.
* **Generating Embeddings**: For each chunk, the system uses `gemini.ts` to call `generateEmbedding()`. 
  * *What is an embedding?* An embedding is simply a way to convert human text into an array of numbers (vectors). The AI uses these numbers to understand the "meaning" of the text mathematically, making it easier to search for related concepts later.
* **Vector Store Storage**: The chunks and their numerical embeddings are sent to `vector-store.ts`. The `addDocumentSections()` function saves them into the `document_sections` table in a Supabase database.
  * *What is a vector store?* It is a specialized database that stores these number arrays (embeddings) and can quickly find pieces of text that have similar meanings (via a similarity query).

---

### PHASE 2: Intelligence & Extraction
This phase applies AI "agents" to extract meaningful data from the vector store.

* **Starting Orchestration**: The `AgentOrchestrator` triggers `executeExtraction(documentId)`.
* **Agent Clusters**: To avoid hitting rate limits and overloading the system, the orchestrator groups the 11 domain agents (e.g., `IdentityAgent`, `EligibilityAgent`, `PricingAgent`, `UnderwritingAgent`, etc.) into smaller clusters of 2 (`clusterSize = 2`) and runs them concurrently.
* **BaseAgent Operations**: Every domain agent inherits from the `BaseAgent` parent class. It triggers its individual `.run(documentId)` function.
* **Getting Context**: 
  * Each domain agent determines what policy detail it needs to look for.
  * It calls the `getContext()` method defined in `BaseAgent`.
  * `getContext()` uses `vector-store.ts` (`searchDocumentSections()`) to perform a vector search, finding the most relevant textual chunks in the Supabase database that match the agent's query.
* **AI Extraction**: Once the relevant subset of text is found, the agent calls `extract()` in the `BaseAgent` class.
* **Gemini LLM Processing**: 
  * The `extract()` method calls `generateStructuredOutput()` inside `gemini.ts`.
  * It combines the found text (context with the prompt limit), task instructions (prompt), and schema constraints, then passes it to the Gemini AI using a JSON-enforced structure.
  * The `gemini.ts` system handles potential errors, rate limits, or transient API glitches using `withRetry` (exponential backoff) and paces requests using a `globalThrottle` lock.
  * The Gemini model reliably returns a constructed JSON block for that exact domain.

---

### PHASE 3: Consolidation & Output
The final step brings all the puzzle pieces together tightly.

* **Merging Results**: The `AgentOrchestrator` gathers all the returning AgentResponses (which carry `status: "success"` and the extracted `data`) from all agents once they finish.
* **Using the Template**: It uses `DEFINITIVE_PAS_SCHEMA` as a blank master blueprint to guarantee the shape of the final JSON output.
* **Deep Merge**: The orchestrator executes `deepMerge()` to stitch and inject all the individually extracted JSON pieces from the domain agents deep inside the master `DEFINITIVE_PAS_SCHEMA` template object.
* **Final JSON File**: The combined, fully structured data is returned to the user as the final JSON output, fully representing the policy content in a structured logic tree.

---

### Summary Table of Key Components

| Component / File | Description & Job |
|---|---|
| **AgentOrchestrator** | (`orchestrator.ts`) The central coordinator that handles the PDF ingestion, orchestrates chunking, manages the clustered execution flow of all 11 agents, and merges the responses into a final JSON. |
| **pdf-parse** | A dependency library used during ingestion to extract raw textual data out of the uploaded PDF file. |
| **Supabase & Postgres** | The relational database where the extracted document chunks and their arrays (embeddings) are preserved inside the custom `document_sections` table. |
| **vector-store.ts** | The database connection bridge. It handles saving new chunks with embeddings (`addDocumentSections`) and querying relevant chunks using algorithmic similarity searches (`searchDocumentSections`). |
| **gemini.ts** | The Gemini API service wrapper. It holds responsibilities for generating vector numbers (`generateEmbedding`), building targeted JSON objects (`generateStructuredOutput`), and safely managing network concurrency locks/retries (`globalThrottle` & `withRetry`). |
| **BaseAgent** | (`base.ts`) The abstract parent class offering standardized methods to all active agents. It dictates how to retrieve information (`getContext`) and request AI extraction (`extract`). |
| **11 Domain Agents** | (e.g., `UnderwritingAgent`, `PricingAgent`) Specialized child agents that extend `BaseAgent`. Each has a unique mandate and isolated prompt to find, extract, and format a distinct slice of the document policy. |
| **DEFINITIVE_PAS_SCHEMA** | (`schema.ts`) The master JSON shell/typing structure acting as the final blueprint. All extracted agent responses map and compile into this singular object shape. |


---

### Complete Architecture & Process Flowchart

```mermaid
flowchart TD

%% STYLING
classDef client fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#000
classDef api fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#000
classDef ingest fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#000
classDef vector fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#000
classDef agent fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#000
classDef llm fill:#ede9fe,stroke:#7c3aed,stroke-width:2px,color:#000
classDef merge fill:#ffedd5,stroke:#ea580c,stroke-width:2px,color:#000

%% CLIENT
User([User Uploads Policy PDF]):::client

%% API LAYER
subgraph API["Next.js API Layer"]
    direction LR
    Route["POST /api/extract<br/>(Extract req.formData)"]:::api
    Orchestrator["AgentOrchestrator<br/>.ingestDocument()<br/>.executeExtraction()"]:::api
    Route --> Orchestrator
end

User --> Route

%% INGESTION
subgraph Ingestion["Phase 1: Document Ingestion"]
    direction LR
    PDFParse["1. pdf-parse(buffer)<br/>Extract Raw Text"]:::ingest
    Clean["2. Clean Text<br/>(Remove \\u0000)"]:::ingest
    ClearDB["3. clearDocumentSections()<br/>(Delete old records)"]:::ingest
    Chunk["4. semanticChunk(text)<br/>Split: 3000 chars<br/>Overlap: 2 paras"]:::ingest
    Embed["5. generateEmbedding()<br/>Model: gemini-embedding-001<br/>Semaphore limit: 5 concurrent<br/>Retries: Max 5"]:::ingest
    Store["6. addDocumentSections()<br/>Batch Insert (Limit 5)"]:::ingest
    
    PDFParse --> Clean --> ClearDB --> Chunk --> Embed --> Store
end

Orchestrator -- "await queue File" --> PDFParse

%% VECTOR DB
subgraph DB["Supabase Database"]
    direction LR
    VectorDB[(document_sections<br/>pgvector Store)]:::vector
    RPC["match_document_sections<br/>(Similarity RPC query)<br/>Limit: 5, Threshold: 0.5"]:::vector
end

Store -- "INSERT (content, metadata, embedding)" --> VectorDB

%% EXTRACTION
subgraph Agents["Phase 2: Domain Agent Extraction"]
    direction TB
    
    subgraph Cluster["Agent Clusters"]
        direction LR
        Agent1["IdentityAgent"]:::agent
        Agent2["EligibilityAgent"]:::agent
        Agent3["BenefitLogicAgent"]:::agent
        Agent4["PricingAgent"]:::agent
        Agent5["LifecycleAgent"]:::agent
        Agent6["ExclusionAgent"]:::agent
        Agent7["ComplianceAgent"]:::agent
    end

    Search["BaseAgent.getContext()<br/>(Compute Query Embedding)"]:::agent
    ExtractRun["BaseAgent.extract()<br/>(Combine Text Context, Prompt, Schema)"]:::agent
    
    LLM["generateStructuredOutput()<br/>Model: gemini-2.0-flash<br/>responseMimeType: application/json<br/>globalThrottle() & withRetry()"]:::llm
    
    Cluster --> Search
    Search --> ExtractRun
    ExtractRun --> LLM
end

Orchestrator -- "Execute Agents" --> Cluster

Search -- "Send Query Vector" --> RPC
RPC -- "Match" --> VectorDB
VectorDB -. "Return Context Chunks" .-> ExtractRun

%% CONSOLIDATION
subgraph Consolidation["Phase 3: Consolidation"]
    direction LR
    Schema["1. Load DEFINITIVE_PAS_SCHEMA<br/>(Master Blueprint template)"]:::merge
    MergeEngine["2. deepMerge(target, source)<br/>Iterate over AgentResponses"]:::merge
    JSON(["3. Return Final JSON<br/>(NextResponse.json)"]):::client
    
    Schema --> MergeEngine --> JSON
end

LLM -- "AgentResponse {status: success, data}" --> Schema
```