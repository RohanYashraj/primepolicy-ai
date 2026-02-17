import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class ComplianceRegulatoryAgent extends BaseAgent {
    public name = "Regulatory & Tax Agent";
    public description = "Captures tax treatment, statutory levies, and compliance disclosures.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract tax treatment codes, statutory levies, and compliance disclosure references.");

            const prompt = `Extract structured tax and regulatory data.
            - tax_treatment_code: e.g., 'Section 80C', 'qualified-plan'.
            - statutory_levies_percent: numeric percentage.
            - compliance_disclosure_ref: code or name of the primary disclosure.
            No paraphrasing.`;

            const schema = JSON.stringify(PAS_EXECUTABLE_SCHEMA.tax_and_regulatory, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { tax_and_regulatory: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
