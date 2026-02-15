import { generateStructuredOutput } from "../gemini";
import { searchDocumentSections } from "../vector-store";

export interface AgentResponse {
    agentName: string;
    data: any;
    status: "success" | "error";
    message?: string;
}

/**
 * Base Agent class providing common RAG and expansion capabilities.
 */
export abstract class BaseAgent {
    public abstract name: string;
    public abstract description: string;

    /**
     * Main entry point for the agent's extraction logic.
     */
    public abstract run(documentId: string): Promise<AgentResponse>;

    /**
     * Helper to retrieve relevant context from the vector store for a specific query.
     */
    protected async getContext(query: string, limit = 5) {
        const results = await searchDocumentSections(query, limit);
        return results.map(r => r.content).join("\n\n---\n\n");
    }

    /**
     * Helper to perform extraction from context using a defined schema.
     */
    protected async extract<T>(context: string, prompt: string, schema: string): Promise<T> {
        const fullPrompt = `
      CONTEXT:
      ${context}

      TASK:
      ${prompt}
    `;

        return generateStructuredOutput<T>(fullPrompt, schema);
    }
}
