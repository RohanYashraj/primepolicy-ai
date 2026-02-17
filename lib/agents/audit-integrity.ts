import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class AuditIntegrityAgent extends BaseAgent {
    public name = "Audit & Integrity Agent";
    public description = "Owner of audit_and_integrity domain (population status and confidence).";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Audit the extraction for completeness, ambiguity, and population status for all sectors.");

            const prompt = `Perform a final audit of the extraction potential.
      - field_population_status: Identify path, status (populated|not_available|inferred), confidence (0-1), and source_reference.
      - overall_extraction_confidence: A singular score (0-1) for the entire payload.
      Return a machine-readable audit trail.`;

            const schema = JSON.stringify({ audit_and_integrity: DEFINITIVE_PAS_SCHEMA.audit_and_integrity }, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data,
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
