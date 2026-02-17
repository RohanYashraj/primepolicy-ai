import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class ProductMetadataAgent extends BaseAgent {
    public name = "Product Metadata Agent";
    public description = "Extracts product identity, jurisdiction, currency, and versioning.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract product name, carrier, LOB, version, market segment, governing laws, admitted status, territory, and currency.");

            const prompt = `Extract product identification and regulatory meta-data.
            Provide machine-enforceable fields:
            - Name, Carrier, LOB Code, Version ID, Market Segment.
            - Governing Laws (list), Admitted Status (boolean), Territory Scope (ISO codes).
            - Currency (ISO 4217), Rounding Rules.
            Translate findings into structured data. Never paraphrase.`;

            const schema = JSON.stringify(CANONICAL_MASTER_SCHEMA.product_metadata, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { product_metadata: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
