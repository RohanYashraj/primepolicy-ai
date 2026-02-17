import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class ProductMetadataAgent extends BaseAgent {
    public name = "PAS Metadata Agent";
    public description = "Extracts PAS-ready product identification, identity attributes, and eligibility rules.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract product name, version label, LOB, carrier, currency, jurisdiction, entry/expiry ages, residency, and sum assured bounds.");

            const prompt = `Extract product context and eligibility rules.
            - product_context: canonical_id, version_label, lob_code, carrier_entity, currency_iso, jurisdiction_code.
            - eligibility_rules: age_entry (min/max), age_expiry (max), residency_status, occupation_classes, sum_assured bounds.
            Strict machine-readable types only. No narrative.`;

            const schema = JSON.stringify({
                product_context: PAS_EXECUTABLE_SCHEMA.product_context,
                eligibility_rules: PAS_EXECUTABLE_SCHEMA.eligibility_rules
            }, null, 2);

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
