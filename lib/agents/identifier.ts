import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class IdentifierAgent extends BaseAgent {
    public name = "Product Identifier Agent";
    public description = "Extracts product identification, carrier info, and market eligibility rules.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract product name, carrier, LOB, version, effective dates, admitted status, and eligibility/territory rules.");

            const prompt = `Perform a high-level identification of this insurance product.
            Focus on providing short, structured values. Use ISO codes for countries if possible.
            - Product Name
            - Carrier Name
            - LOB Code (e.g., 'CYB' for Cyber, 'PL' for Professional Liability, 'GL' for General Liability)
            - Version/Release Title
            - Dates in YYYY-MM-DD format
            - Admitted status (true/false)
            - Currency code (USD, GBP, etc.)
            - Eligibility Rules: allowed/excluded industries, territory codes, financial thresholds.`;

            const schema = JSON.stringify({
                product_summary: MASTER_SCHEMA.product_summary,
                eligibility_rules: MASTER_SCHEMA.eligibility_rules
            }, null, 2);

            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data,
                status: "success",
            };
        } catch (error: any) {
            return {
                agentName: this.name,
                data: null,
                status: "error",
                message: error.message,
            };
        }
    }
}
