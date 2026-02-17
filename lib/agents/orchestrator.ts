import { IdentifierAgent } from "./identifier";
import { FeatureAgent } from "./features";
import { RuleAgent } from "./rules";
import { addDocumentSections, clearDocumentSections } from "../vector-store";
import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class AgentOrchestrator {
    private agents: BaseAgent[] = [];

    constructor() {
        this.agents = [
            new IdentifierAgent(),
            new FeatureAgent(),
            new RuleAgent(),
        ];
    }

    /**
     * Phase 1: Intake - Parses, chunks, and indexes the document.
     */
    public async ingestDocument(buffer: Buffer, fileName: string) {
        console.log(`[ORCHESTRATOR] Starting ingestion for: ${fileName}`);

        let pdfData;
        try {
            const mod = require("pdf-parse");
            const PDFParseClass = mod.PDFParse || mod.default?.PDFParse;

            if (PDFParseClass) {
                console.log("[ORCHESTRATOR] Using PDFParse class API");
                const parser = new PDFParseClass({ data: buffer });
                pdfData = await parser.getText();
            } else if (typeof mod === 'function') {
                console.log("[ORCHESTRATOR] Falling back to classic function API");
                pdfData = await mod(buffer);
            } else if (typeof mod.default === 'function') {
                console.log("[ORCHESTRATOR] Falling back to classic default function API");
                pdfData = await mod.default(buffer);
            } else {
                throw new Error("Could not find a valid PDF parsing entry point");
            }
        } catch (e) {
            console.error("[ORCHESTRATOR] PDF parsing failed:", e);
            throw new Error(`PDF processing engine failed: ${e instanceof Error ? e.message : "Unknown error"}`);
        }

        let text = pdfData.text || "";
        text = text.replace(/\u0000/g, "");

        await clearDocumentSections(fileName);
        const chunks = this.semanticChunk(text);

        const sections = chunks.map((content, index) => ({
            content,
            metadata: {
                source: fileName,
                chunkIndex: index,
                totalChunks: chunks.length,
            },
        }));

        await addDocumentSections(sections);

        return {
            message: "Ingestion complete",
            chunksCreated: chunks.length,
        };
    }

    /**
     * Phase 2: Extraction - Runs all agents to build structured artefacts.
     */
    public async executeExtraction(documentId: string): Promise<any> {
        console.log(`[ORCHESTRATOR] Starting multi-agent extraction for: ${documentId}`);
        const results = await Promise.all(
            this.agents.map(agent => agent.run(documentId))
        );

        // Initialize with default empty values from MASTER_SCHEMA to ensure fixed structure
        const consolidatedData: any = {
            product_summary: { ...MASTER_SCHEMA.product_summary },
            eligibility_rules: { ...MASTER_SCHEMA.eligibility_rules },
            product_features: [],
            limitations_exclusions: [],
            compliance_admin: { ...MASTER_SCHEMA.compliance_admin },
            claims_procedures: [],
        };

        // Merge results from each agent
        results.forEach(res => {
            if (res.status === "success" && res.data) {
                Object.assign(consolidatedData, res.data);
            } else {
                console.warn(`[ORCHESTRATOR] Agent ${res.agentName} failed or returned no data: ${res.message}`);
            }
        });

        return consolidatedData;
    }

    /**
     * Simple semantic chunker that respects paragraph boundaries.
     */
    private semanticChunk(text: string): string[] {
        const paragraphs = text.split(/\n\n+/);
        const chunks: string[] = [];
        let currentChunk = "";

        for (const para of paragraphs) {
            if ((currentChunk.length + para.length) > 1500 && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
            }
            currentChunk += para + "\n\n";
        }

        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    }
}
