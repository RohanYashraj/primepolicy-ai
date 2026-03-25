import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class ComplianceAgent extends BaseAgent {
    public name = "Compliance Agent";
    public description = "Owner of tax_and_regulatory domain.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext(documentId, "Extract tax benefits and regulatory notes.");

            const prompt = `Extract structured tax and regulatory data.
      - tax_benefits_summary: Summary of tax benefits (e.g. 80C, 10(10D)). Null if not applicable.
      - regulatory_notes: Any regulatory disclosures, constraints, or notes. Null if not applicable.
      Strictly follow the DEFINITIVE_PAS_SCHEMA.tax_and_regulatory structure.`;

            const schema = JSON.stringify({ tax_and_regulatory: DEFINITIVE_PAS_SCHEMA.tax_and_regulatory }, null, 2);
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
