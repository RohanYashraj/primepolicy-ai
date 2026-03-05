import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class IdentityAgent extends BaseAgent {
    public name = "Identity Agent";
    public description = "Owner of product name, family, variant, line of business, jurisdiction, and currency.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext(documentId, "Extract product name, family, variant code, line of business, country/state codes, regulator, and currency.");

            const prompt = `Extract global product identity details.
      - product_name: Full marketing name.
      - product_family: TERM | ENDOWMENT | ULIP | ANNUITY | HEALTH
      - variant_code: internal code if present.
      - line_of_business: e.g. TERM, HEALTH, etc.
      - jurisdiction: country_code (ISO-3166-1) and regulator name.
      - currency: currency code (ISO-4217).
      Use null if any value is not available. Strictly follow the JSON structure provided.`;

            const schema = JSON.stringify({
                product_context: DEFINITIVE_PAS_SCHEMA.product_context
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
