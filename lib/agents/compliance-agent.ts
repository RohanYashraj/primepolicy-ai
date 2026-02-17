import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class ComplianceAgent extends BaseAgent {
    public name = "Compliance Agent";
    public description = "Owner of tax_and_regulatory domain.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract tax benefits (80C, 10(10D)), statutory disclosures, and regulatory constraints.");

            const prompt = `Extract structured tax and regulatory data.
      - tax_benefits: e.g., 'SECTION_80C', 'SECTION_10_10D'.
      - statutory_disclosures: list of mandatory statements.
      - regulatory_constraints: specific limitations or reporting obligations.
      No paraphrasing. Convert findings into structured lists.`;

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
