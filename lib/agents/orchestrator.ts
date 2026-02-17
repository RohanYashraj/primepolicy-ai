import { SchemaGuardianAgent } from "./schema-guardian";
import { ProductMetadataAgent } from "./product-metadata";
import { CoverageBenefitsAgent } from "./coverage-benefits";
import { PremiumPaymentAgent } from "./premium-payment";
import { LifecycleRulesAgent } from "./lifecycle-rules";
import { FinancialOperationsAgent } from "./financial-operations";
import { UnderwritingRulesAgent } from "./underwriting-rules";
import { ExclusionsLimitationsAgent } from "./exclusions-limitations";
import { ComplianceRegulatoryAgent } from "./compliance-regulatory";
import { ValidationAuditAgent } from "./validation-audit";
import { addDocumentSections, clearDocumentSections } from "../vector-store";
import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class AgentOrchestrator {
    private agents: BaseAgent[] = [];

    constructor() {
        this.agents = [
            new SchemaGuardianAgent(),
            new ProductMetadataAgent(),
            new CoverageBenefitsAgent(),
            new PremiumPaymentAgent(),
            new LifecycleRulesAgent(),
            new FinancialOperationsAgent(),
            new UnderwritingRulesAgent(),
            new ExclusionsLimitationsAgent(),
            new ComplianceRegulatoryAgent(),
            new ValidationAuditAgent(),
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
        return { message: "Ingestion complete", chunksCreated: chunks.length };
    }

    public async executeExtraction(documentId: string): Promise<any> {
        console.log(`[ORCHESTRATOR] Starting PAS-executable extraction for: ${documentId}`);
        const results = await Promise.all(this.agents.map(agent => agent.run(documentId)));

        const consolidatedData: any = JSON.parse(JSON.stringify(PAS_EXECUTABLE_SCHEMA));

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
        for (const para of paragraphs) {
            if ((currentChunk.length + para.length) > 1500 && currentChunk.length > 0) {
                chunks.push(currentChunk.trim());
                currentChunk = "";
            }
            currentChunk += para + "\n\n";
        }
        if (currentChunk.trim().length > 0) chunks.push(currentChunk.trim());
        return chunks;
    }
}
