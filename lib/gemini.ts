import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "./utils";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Simple Semaphore for global throttling
 */
class Semaphore {
    private tasks: (() => void)[] = [];
    constructor(private count: number) { }

    async acquire() {
        if (this.count > 0) {
            this.count--;
            return;
        }
        await new Promise<void>(resolve => this.tasks.push(resolve));
    }

    release() {
        if (this.tasks.length > 0) {
            const next = this.tasks.shift();
            next?.();
        } else {
            this.count++;
        }
    }
}

// Global throttle: Max 5 concurrent LLM calls
const globalThrottle = new Semaphore(5);

/**
 * Helper to wrap functions with exponential backoff retry logic.
 */
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 5, baseDelay = 1500): Promise<T> {
    let lastError: any;
    for (let i = 0; i <= maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            const isServiceError = error.message?.includes("503") ||
                error.message?.includes("Service Unavailable") ||
                error.message?.includes("429") ||
                error.message?.includes("Too Many Requests") ||
                error.message?.includes("Unexpected end of JSON input") ||
                error.message?.includes("protocol error") ||
                error.message?.includes("fetch failed");

            if (!isServiceError || i === maxRetries) {
                break;
            }

            const delay = baseDelay * Math.pow(2, i);
            // Moved to debug to avoid terminal noise
            logger.debug(`[GEMINI] Transient error: ${error.message}. Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}

/**
 * Generates an embedding for a given text chunk.
 */
export async function generateEmbedding(text: string) {
    return withRetry(async () => {
        await globalThrottle.acquire();
        try {
            const modelName = process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-001";
            logger.debug(`[GEMINI] Using embedding model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.embedContent({
                content: { role: "user", parts: [{ text }] },
                outputDimensionality: 768,
            } as any);
            return result.embedding.values;
        } finally {
            globalThrottle.release();
        }
    });
}

/**
 * Interacts with Gemini Pro for structured extraction or general reasoning.
 */
export async function generateContent(prompt: string, modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash") {
    return withRetry(async () => {
        await globalThrottle.acquire();
        try {
            logger.debug(`[GEMINI] Using content model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } finally {
            globalThrottle.release();
        }
    });
}

/**
 * Generates structured JSON output from Gemini using a schema-following prompt.
 */
export async function generateStructuredOutput<T>(prompt: string, schemaDescription: string): Promise<T> {
    logger.debug("[GEMINI] Generating structured output...");

    return withRetry(async () => {
        await globalThrottle.acquire();
        try {
            const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
            logger.debug(`[GEMINI] Generating structured output with model: ${modelName}...`);
            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: "application/json",
                }
            });

            const fullPrompt = `
        ${prompt}
        
        You MUST return the output as a JSON object following this schema:
        ${schemaDescription}
      `;

            const result = await model.generateContent(fullPrompt);
            const text = result.response.text();
            logger.debug("[GEMINI] Response received");
            return JSON.parse(text) as T;
        } finally {
            globalThrottle.release();
        }
    }).catch((error: any) => {
        logger.error(`[GEMINI] Final failure: ${error.message}`);
        throw new Error(`Gemini failed after retries: ${error.message}`);
    });
}
