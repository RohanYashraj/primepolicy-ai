import { SchemaGuardianAgent } from "./schema-guardian";
import { IdentityAgent } from "./identity-agent";
import { EligibilityAgent } from "./eligibility-agent";
import { BenefitLogicAgent } from "./benefit-logic";
import { PricingAgent } from "./pricing-agent";
import { LifecycleAgent } from "./lifecycle-agent";
import { UnderwritingAgent } from "./underwriting-agent";
import { ExclusionAgent } from "./exclusion-agent";
import { ClaimsAgent } from "./claims-agent";
import { ComplianceAgent } from "./compliance-agent";
import { AuditIntegrityAgent } from "./audit-integrity";
import { addDocumentSections, clearDocumentSections } from "../vector-store";
import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";
import { logger } from "../utils";

export class AgentOrchestrator {
    private agents: BaseAgent[] = [];

    constructor() {
        this.agents = [
            new SchemaGuardianAgent(),
            new IdentityAgent(),
            new EligibilityAgent(),
            new BenefitLogicAgent(),
            new PricingAgent(),
            new LifecycleAgent(),
            new UnderwritingAgent(),
            new ExclusionAgent(),
            new ClaimsAgent(),
            new ComplianceAgent(),
            new AuditIntegrityAgent(), // Not functional in extraction but handles integrity reporting
        ];
    }

    public async ingestDocument(buffer: Buffer, fileName: string) {
        let pdfData;
        try {
            const mod = require("pdf-parse");
            if (typeof mod === 'function') {
                pdfData = await mod(buffer);
            } else if (typeof mod.default === 'function') {
                pdfData = await mod.default(buffer);
            } else {
                throw new Error("Could not find a valid PDF parsing entry point");
            }
        } catch (e) {
            throw new Error(`PDF processing engine failed: ${e instanceof Error ? e.message : "Unknown error"}`);
        }

        let text = pdfData.text || "";
        text = text.replace(/\u0000/g, "");

        await clearDocumentSections(fileName);
        const chunks = this.semanticChunk(text);
        const sections = chunks.map((content, index) => ({
            content,
            metadata: { source: fileName, chunkIndex: index, totalChunks: chunks.length },
        }));

        await addDocumentSections(sections);
        logger.info(`Ingestion complete: ${chunks.length} chunks created for ${fileName}`);
        return { message: "Ingestion complete", chunksCreated: chunks.length };
    }

    public async executeExtraction(documentId: string): Promise<any> {
        logger.info(`[ORCHESTRATOR] Starting definitive PAS extraction for: ${documentId}`);

        // Execute agents in clusters to avoid hitting rate limits and reduce redundant work
        const results: AgentResponse[] = [];
        const clusterSize = 2;
        for (let i = 0; i < this.agents.length; i += clusterSize) {
            const cluster = this.agents.slice(i, i + clusterSize);
            logger.debug(`[ORCHESTRATOR] Executing agent cluster: ${cluster.map(a => a.name).join(", ")}`);
            const clusterResults = await Promise.all(cluster.map(agent => agent.run(documentId)));
            results.push(...clusterResults);
        }

        const consolidatedData: any = JSON.parse(JSON.stringify(DEFINITIVE_PAS_SCHEMA));

        results.forEach(res => {
            if (res.status === "success" && res.data) {
                this.deepMerge(consolidatedData, res.data);
            }
        });

        return consolidatedData;
    }

    private deepMerge(target: any, source: any) {
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                this.deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    private semanticChunk(text: string): string[] {
        const paragraphs = text.split(/\n\n+/);
        const chunks: string[] = [];
        let currentChunk = "";
        const overlapCount = 2; // Number of paragraphs to overlap
        const recentParagraphs: string[] = [];

        for (const para of paragraphs) {
            const cleanPara = para.trim().replace(/\u0000/g, "");
            if (cleanPara.length === 0) continue;

            if ((currentChunk.length + cleanPara.length) > 3000 && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                // Keep the last few paragraphs for overlap
                currentChunk = recentParagraphs.slice(-overlapCount).join("\n\n") + "\n\n";
            }
            currentChunk += cleanPara + "\n\n";
            recentParagraphs.push(cleanPara);
        }
        if (currentChunk.trim().length > 0) chunks.push(currentChunk.trim());
        return chunks;
    }
}
