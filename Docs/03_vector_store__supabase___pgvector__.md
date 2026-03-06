# Chapter 3: Vector Store (Supabase + pgvector)

In [Chapter 2: Document Ingestion & Semantic Chunking](02_document_ingestion___semantic_chunking_.md), we learned how to take a large, raw PDF document, extract its text, clean it, and then intelligently break it down into smaller, meaningful "chunks." These chunks are perfect for our AI agents to process. But once we have these chunks, where do they go? And more importantly, how do our specialist agents quickly find the *exact* chunks they need to answer specific questions, especially when there might be thousands of chunks from many different policy documents?

Imagine you have a massive library filled with millions of books, but they're all just piled up randomly on the floor. If you ask a librarian to find all information about "deductibles for health insurance," it would take forever! You need a system to organize these books so they can be easily found.

This is exactly the problem the **Vector Store** solves for our project. It acts as our project's super-smart librarian and organized archive, a specialized long-term memory for all our policy document chunks.

## What is the Vector Store?

The Vector Store is a special kind of database designed to store and quickly search for information based on its *meaning*, not just keywords. Think of it as a digital brain that understands the context of information.

In our project, we use **Supabase** (a powerful open-source platform that includes a PostgreSQL database) combined with a special PostgreSQL extension called **pgvector**. This combination creates our efficient and scalable Vector Store.

## Why Do We Need a Vector Store?

Our AI agents (which we'll meet in [Chapter 5: Specialist Agents](05_specialist_agents_.md)) don't just "read" text like humans do. When they need to answer a question, they need to quickly find the most relevant pieces of information from the entire collection of document chunks.

The Vector Store provides two critical capabilities for this:

1.  **Semantic Storage**: It stores our document chunks in a way that captures their meaning.
2.  **Fast Similarity Search**: It can rapidly find chunks that are "semantically similar" (meaningfully related) to a given question or query.

This process is called **Retrieval-Augmented Generation (RAG)**. It means the AI first *retrieves* relevant information from our Vector Store and then *generates* an answer using that information, ensuring its responses are accurate and grounded in our specific policy documents.

## Key Concepts of the Vector Store

To understand how the Vector Store works, let's break down its core ideas:

### 1. Embeddings: The AI's Secret Language

Imagine you want to represent words or sentences as numbers.
*   The word "dog" might be `[0.1, 0.5, -0.2, 0.9, ...]`.
*   The word "puppy" might be `[0.11, 0.52, -0.21, 0.93, ...]`.
*   The word "cat" might be `[0.8, -0.1, 0.3, 0.05, ...]`.

Notice how the numbers for "dog" and "puppy" are very similar, while "cat" is quite different? This is the magic of **embeddings**.

*   **What they are**: Embeddings are long lists of numbers (called vectors) that represent text (like our policy chunks or a user's question) in a way that captures its semantic meaning.
*   **How they are created**: We use an AI model ([Gemini LLM Interaction (with Throttling & Retries)](04_gemini_llm_interaction__with_throttling___retries__.md)) to convert our text chunks into these numerical embeddings.
*   **The Big Idea**: Text with similar meanings will have embeddings that are numerically "close" to each other in this multi-dimensional space. Text with different meanings will be "far apart."

### 2. Similarity Search: Finding Meaningful Matches

Once our document chunks are converted into embeddings and stored in the Vector Store, finding relevant information becomes a mathematical problem:

*   When an AI agent asks a question (e.g., "What are the eligibility requirements?"), that question is *also* converted into an embedding.
*   The Vector Store then performs a "similarity search" to find the document chunk embeddings that are numerically closest to the question's embedding.
*   The closest embeddings correspond to the most semantically relevant document chunks.

This is much faster and more accurate than keyword searching because it understands context and meaning.

### 3. Supabase + pgvector: Our Tools of Choice

*   **Supabase**: This is our hosted PostgreSQL database. It's a robust and easy-to-use platform that handles all the database infrastructure for us.
*   **pgvector**: This is a special extension for PostgreSQL that turns it into a powerful Vector Store. It allows us to:
    *   Store embeddings (those lists of numbers) efficiently.
    *   Perform very fast similarity searches on those embeddings.

## How Our Project Uses the Vector Store

The Vector Store is critical at two main points in our policy extraction pipeline:

### 1. Storing Document Chunks After Ingestion

After [Chapter 2: Document Ingestion & Semantic Chunking](02_document_ingestion___semantic_chunking_.md) has broken down a PDF into clean, semantic chunks, these chunks need to be stored. This is where the Vector Store comes in.

In [Chapter 1: Agent Orchestrator](01_agent_orchestrator_.md), we saw the `ingestDocument` method. Part of its job is to add these chunks to our Vector Store.

**Example Input (Conceptual):**

Imagine a list of document chunks, each with its text content and some metadata (like the original `fileName`).

```typescript
// Conceptual input for storing
const myChunks = [
  { content: "Eligibility criteria: Must be 18-65 years old...", metadata: { source: "my_policy.pdf" } },
  { content: "Benefits include 80% coverage for doctor visits...", metadata: { source: "my_policy.pdf" } },
  // ... more chunks ...
];
```

**How it's used in `AgentOrchestrator` (Simplified):**

```typescript
// lib/agents/orchestrator.ts (Simplified)
import { addDocumentSections } from "../vector-store"; // Our vector store utility

// ... inside AgentOrchestrator class ...

public async ingestDocument(buffer: Buffer, fileName: string) {
    // ... text extraction and semantic chunking happens here ...
    const chunks = this.semanticChunk(text); // Returns string[]

    // Store these chunks in the Vector Store
    // Each string chunk is mapped to a DocumentSection object
    await addDocumentSections(chunks.map(content => ({ content, metadata: { source: fileName } })));

    // ... rest of the method ...
}
```
**Explanation:** The `orchestrator.ingestDocument` method calls `addDocumentSections` (which is our utility for interacting with the Vector Store). It passes in all the prepared `chunks`, along with the `fileName` so we know which document they came from. The `addDocumentSections` function will then convert each chunk into an embedding and save it to Supabase using `pgvector`.

### 2. Retrieving Relevant Information for Specialist Agents

When a [Specialist Agent](05_specialist_agents_.md) needs to find specific information to answer a question, it "asks" the Vector Store.

**Example Input (Conceptual):**

A specialist agent might ask a question like: "What are the age requirements for this policy?"

```typescript
// Conceptual input for searching
const agentQuestion = "What are the age requirements for this policy?";
const policyDocumentName = "my_policy.pdf"; // To narrow down the search
```

**How it's used by `Specialist Agents` (Conceptual):**

```typescript
// Example: Inside an EligibilityAgent
import { searchDocumentSections } from "../vector-store";

// ... inside EligibilityAgent class's run method ...

public async run(documentId: string): Promise<AgentResponse> {
    const question = "What are the minimum and maximum age requirements for this policy?";
    
    // Ask the Vector Store to find relevant document chunks
    const relevantChunks = await searchDocumentSections(question, 3, 0.7, documentId);

    // Use these chunks to formulate an answer with the LLM
    // ... (logic for LLM interaction, as seen in Chapter 4) ...
    
    // ... return the agent's findings ...
}
```
**Explanation:** When an agent needs information, it formulates a `question`. It then calls `searchDocumentSections`, passing its `question` and specifying how many relevant chunks it wants (`3`) and from which `documentId`. The Vector Store quickly processes this and returns the most semantically relevant policy chunks, which the agent can then use to generate its specific answer.

## Behind the Scenes: How Supabase + pgvector Works

Let's look at the flow and code that makes our Vector Store tick.

### Step-by-Step Flow: Ingestion and Retrieval

Here's how the Vector Store integrates into the overall process:

```mermaid
sequenceDiagram
    participant Orchestrator
    participant Vector Store (Supabase + pgvector)
    participant Embedding Model (Gemini)
    participant Specialist Agent

    Orchestrator->>Vector Store (Supabase + pgvector): 1. Add Chunks (text content, metadata)
    Note over Vector Store (Supabase + pgvector): For each chunk:
    Vector Store (Supabase + pgvector)->>Embedding Model (Gemini): 2. Generate Embedding (chunk text)
    Embedding Model (Gemini)-->>Vector Store (Supabase + pgvector): 3. Returns numerical embedding
    Vector Store (Supabase + pgvector)->>Vector Store (Supabase + pgvector): 4. Store chunk text + embedding in PostgreSQL table
    Note over Vector Store (Supabase + pgvector): All chunks stored
    
    Specialist Agent->>Vector Store (Supabase + pgvector): 5. Search Relevant Chunks (question text, count)
    Vector Store (Supabase + pgvector)->>Embedding Model (Gemini): 6. Generate Embedding (question text)
    Embedding Model (Gemini)-->>Vector Store (Supabase + pgvector): 7. Returns numerical embedding for question
    Vector Store (Supabase + pgvector)->>Vector Store (Supabase + pgvector): 8. Perform Similarity Search in PostgreSQL
    Vector Store (Supabase + pgvector)-->>Specialist Agent: 9. Returns top N relevant chunks
```

### Code Walkthrough: `lib/vector-store.ts`

Our `lib/vector-store.ts` file contains the functions that interact directly with our Supabase + pgvector database.

First, we need a way to connect to Supabase. This is handled by a utility function:

```typescript
// lib/supabase/server.ts (Simplified)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  // This function securely creates a Supabase client connection.
  // It handles authentication and configuration for our database.
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { /* ... cookie handling ... */ },
  );
}
```
**Explanation:** The `createClient` function is our secure gateway to Supabase. Every time we need to talk to the database, we use this to get a connection.

Now, let's look at the core functions in `lib/vector-store.ts`:

#### 1. Adding Document Sections (`addDocumentSections`)

This function takes the text chunks, generates their embeddings, and then saves them to our Supabase database.

```typescript
// lib/vector-store.ts (Simplified)
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "./gemini"; // Converts text to numbers

export async function addDocumentSections(sections: DocumentSection[]) {
    const supabase = await createClient(); // Get our database connection

    const concurrencyLimit = 5; // Process 5 chunks at a time to avoid API limits
    const sectionsWithEmbeddings: DocumentSection[] = [];

    // Loop through chunks in batches
    for (let i = 0; i < sections.length; i += concurrencyLimit) {
        const batch = sections.slice(i, i + concurrencyLimit);
        // For each chunk in the batch, generate its embedding
        const batchResults = await Promise.all(
            batch.map(async (section) => ({
                ...section,
                embedding: await generateEmbedding(section.content), // AI generates the numerical representation
            }))
        );
        sectionsWithEmbeddings.push(...batchResults);
    }

    // Insert all chunks (with their embeddings) into the 'document_sections' table
    const { error } = await supabase
        .from("document_sections")
        .insert(sectionsWithEmbeddings);

    if (error) {
        console.error("Error adding document sections:", error);
        throw error;
    }
}
```
**Explanation:**
1.  **`createClient()`**: We first establish a connection to our Supabase database.
2.  **`concurrencyLimit = 5`**: Generating embeddings for many chunks can be slow or hit API rate limits. So, we process them in small batches (`5` at a time) to be efficient and polite to the AI model.
3.  **`generateEmbedding(section.content)`**: This is the crucial step! For each text chunk, we call `generateEmbedding` (which uses our [Gemini LLM Interaction](04_gemini_llm_interaction__with_throttling___retries__.md) utility) to convert its text into a numerical embedding.
4.  **`supabase.from("document_sections").insert(...)`**: Once all chunks have their embeddings, we insert them into our `document_sections` table in Supabase. This table stores the original `content` (text), `metadata` (like the source file name), and the new `embedding` (the list of numbers).

#### 2. Searching Document Sections (`searchDocumentSections`)

This function takes a query, converts it into an embedding, and then asks `pgvector` to find the most similar document chunks.

```typescript
// lib/vector-store.ts (Simplified)
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "./gemini"; // Converts text to numbers

export async function searchDocumentSections(
    query: string,
    matchCount = 5,
    matchThreshold = 0.5,
    documentId?: string
): Promise<DocumentSection[]> {
    const supabase = await createClient(); // Get our database connection
    
    // 1. Convert the search query (question) into a numerical embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2. Use a special Supabase function (RPC) to perform the similarity search
    const { data, error } = await supabase.rpc("match_document_sections", {
        query_embedding: queryEmbedding, // The embedding of our question
        match_threshold: matchThreshold, // How similar the results must be (0.0 to 1.0)
        match_count: documentId ? 100 : matchCount, // How many results to fetch
    });

    if (error) throw error;

    let results = data as DocumentSection[];
    // If a specific document was requested, filter the results further
    if (documentId) {
        results = results.filter(row => row.metadata?.source === documentId);
    }
    // Return the top 'matchCount' results
    return results.slice(0, matchCount);
}
```
**Explanation:**
1.  **`createClient()`**: Again, we get our database connection.
2.  **`generateEmbedding(query)`**: Just like with document chunks, the `query` (the question an agent is asking) is also converted into its own numerical embedding.
3.  **`supabase.rpc("match_document_sections", ...)`**: This is where `pgvector` shines! `rpc` stands for "Remote Procedure Call," and it allows us to call a custom function defined directly in our PostgreSQL database. `match_document_sections` is a special function (using `pgvector`) that:
    *   Takes our `query_embedding`.
    *   Compares it to all the `embedding`s stored in the `document_sections` table.
    *   Returns the chunks that are most similar, based on `match_threshold` and `match_count`.
4.  **Filtering (`if (documentId)`)**: If the agent specified a `documentId`, we filter the results to ensure we only get chunks from that specific policy document.
5.  **Return**: The function returns the most relevant `DocumentSection` objects (which include the original text content) to the calling agent.

## Conclusion

The Vector Store, powered by Supabase and `pgvector`, is the "long-term memory" of our `primepolicy-ai-main` project. By converting policy document chunks into numerical embeddings and using blazing-fast similarity searches, it ensures that our AI agents can always retrieve the most relevant and precise information from vast amounts of text. This retrieval-augmented generation (RAG) approach is fundamental to building an intelligent system that provides accurate and context-aware answers.

Now that we understand how information is stored and retrieved, the next logical step is to see how our AI agents actually use this information to generate insights. In the next chapter, we'll dive into how our system interacts with the powerful Gemini Large Language Model.

[Next Chapter: Gemini LLM Interaction (with Throttling & Retries)](04_gemini_llm_interaction__with_throttling___retries__.md)

---