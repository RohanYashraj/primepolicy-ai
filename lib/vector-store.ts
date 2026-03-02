import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "./gemini";

export interface DocumentSection {
    id?: number;
    content: string;
    metadata: Record<string, any>;
    embedding?: number[];
    similarity?: number;
}

/**
 * Adds a collection of document sections to the vector store.
 */
export async function addDocumentSections(sections: DocumentSection[]) {
    const supabase = await createClient();

    // Process in batches to avoid rate limits
    const concurrencyLimit = 5;
    const sectionsWithEmbeddings: DocumentSection[] = [];

    for (let i = 0; i < sections.length; i += concurrencyLimit) {
        const batch = sections.slice(i, i + concurrencyLimit);
        const batchResults = await Promise.all(
            batch.map(async (section) => ({
                ...section,
                embedding: await generateEmbedding(section.content),
            }))
        );
        sectionsWithEmbeddings.push(...batchResults);
    }

    const { error } = await supabase
        .from("document_sections")
        .insert(sectionsWithEmbeddings);

    if (error) {
        console.error("Error adding document sections:", error);
        throw error;
    }
}

/**
 * Searches for the most relevant document sections given a query.
 */
export async function searchDocumentSections(query: string, matchCount = 5, matchThreshold = 0.5): Promise<DocumentSection[]> {
    const maxRetries = 3;
    let lastError: any;

    for (let i = 0; i <= maxRetries; i++) {
        try {
            const supabase = await createClient();
            const queryEmbedding = await generateEmbedding(query);

            const { data, error } = await supabase.rpc("match_document_sections", {
                query_embedding: queryEmbedding,
                match_threshold: matchThreshold,
                match_count: matchCount,
            });

            if (error) throw error;
            return data as DocumentSection[];
        } catch (error: any) {
            lastError = error;
            const isTransient = error.message?.includes("520") ||
                error.message?.includes("525") ||
                error.message?.includes("FetchError") ||
                error.message?.includes("Unexpected end of JSON input") ||
                error.message?.includes("protocol error") ||
                error.message?.includes("fetch failed");
            if (!isTransient || i === maxRetries) break;

            const delay = 1000 * Math.pow(2, i);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    console.error("Error searching document sections:", lastError);
    throw lastError;
}

/**
 * Clears document sections (useful for POC/debugging).
 */
export async function clearDocumentSections(documentSource?: string) {
    const supabase = await createClient();

    let query = supabase.from("document_sections").delete();

    if (documentSource) {
        query = query.eq("metadata->>source", documentSource);
    } else {
        query = query.neq("id", -1); // Delete all
    }

    const { error } = await query;
    if (error) {
        console.error("Error clearing document sections:", error);
        throw error;
    }
}
