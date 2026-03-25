import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class PricingAgent extends BaseAgent {
    public name = "Pricing Agent";
    public description = "Owner of premium_structure domain.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext(documentId, "Extract payment structure, frequencies, and grace periods.");

            const prompt = `Extract deterministic premium rules.
      - payment_type: single | regular | limited
      - premium_payment_term_years: payment term in years, or null if single pay.
      - frequencies_allowed: annual, half_yearly, quarterly, monthly.
      - grace_period_days: grace period in days.
      Strictly follow the defined types for all fields in DEFINITIVE_PAS_SCHEMA.premium_structure.`;

            const schema = JSON.stringify({ premium_structure: DEFINITIVE_PAS_SCHEMA.premium_structure }, null, 2);
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
