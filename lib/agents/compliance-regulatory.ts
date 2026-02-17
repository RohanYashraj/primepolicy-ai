import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class ComplianceRegulatoryAgent extends BaseAgent {
    public name = "Compliance & Regulatory Agent";
    public description = "Captures governing law, disclosures, statutory constraints, and reporting obligations.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract statutory constraints, compliance disclosures, reporting obligations, and specific governing law state.");

            const prompt = `Extract structured compliance data.
            - List of event definitions/reporting obligations.
            - Reporting timeline and documentation.
            - Settlement logic.
            Focus on governing laws and statutory constraints.`;

            // Note: The schema for this agent is partially covered in jurisdiction_compliance and partially in claims_administration.
            // But the user asked for a dedicated agent. He also mentioned 'Compliance & Regulatory Agent that captures governing law, disclosures, statutory constraints, and reporting obligations'.
            // In our schema.ts, these are in product_metadata.jurisdiction_compliance and claims_administration.
            // I will adjust the prompt to populate a virtual 'compliance_regulatory' object that we will merge properly.

            const schema = JSON.stringify({
                governing_law_state: "string",
                statutory_disclosures: ["string"],
                regulatory_constraints: ["string"]
            }, null, 2);

            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { compliance_regulatory: data }, // We'll handle fusion in orchestrator
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
