import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class IdentityAgent extends BaseAgent {
    public name = "Identity Agent";
    public description = "Owner of product versioning, line of business, jurisdiction, and currency.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract version numbers, approval/effective dates, line of business (primary/secondary), country/state codes, and currency ISO/rounding.");

            const prompt = `Extract versioning, LOB, jurisdiction, and currency details.
      - version: number, approval_date, effective_date, expiry_date (YYYY-MM-DD).
      - line_of_business: primary (TERM|ENDOWMENT|ULIP|ANNUITY|HEALTH) and secondary.
      - jurisdiction: country_code (ISO-3166-1), state_code (ISO-3166-2), regulator name.
      - currency: iso_code (ISO-4217), rounding_rules.
      Convert all dates to YYYY-MM-DD. Use null if not available.`;

            const schema = JSON.stringify({
                product_context: {
                    version: DEFINITIVE_PAS_SCHEMA.product_context.version,
                    line_of_business: DEFINITIVE_PAS_SCHEMA.product_context.line_of_business,
                    jurisdiction: DEFINITIVE_PAS_SCHEMA.product_context.jurisdiction,
                    currency: DEFINITIVE_PAS_SCHEMA.product_context.currency
                }
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
