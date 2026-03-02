import { generateStructuredOutput } from "../gemini";
import { searchDocumentSections } from "../vector-store";
import { logger } from "../utils";

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
        logger.debug(`[${this.name}] Getting context for: ${query}`);
        const results = await searchDocumentSections(query, limit);
        logger.debug(`[${this.name}] Found ${results.length} relevant sections`);
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

        logger.debug(`[${this.name}] Starting extraction with prompt: ${prompt.substring(0, 50)}...`);
        const result = await generateStructuredOutput<T>(fullPrompt, schema);
        logger.debug(`[${this.name}] Extraction complete`);
        return result;
    }
}
