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

    const sectionsWithEmbeddings = await Promise.all(
        sections.map(async (section) => ({
            ...section,
            embedding: await generateEmbedding(section.content),
        }))
    );

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
    const supabase = await createClient();
    const queryEmbedding = await generateEmbedding(query);

    const { data, error } = await supabase.rpc("match_document_sections", {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
    });

    if (error) {
        console.error("Error searching document sections:", error);
        throw error;
    }

    return data as DocumentSection[];
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
