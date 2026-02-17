import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class PricingAgent extends BaseAgent {
    public name = "Pricing Agent";
    public description = "Owner of premium_rules domain (calculation and structure).";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract payment structure, frequencies, grace periods, calculation method, rating factors, and taxes/charges.");

            const prompt = `Extract deterministic premium rules.
      - payment_structure: type (single/regular/limited), term years.
      - frequencies_allowed: annual, half_yearly, quarterly, monthly.
      - grace_period: duration, unit.
      - premium_calculation: method, factors, and table references.
      - taxes_and_charges: GST and other levies.
      Strictly follow the defined types for all fields.`;

            const schema = JSON.stringify({ premium_rules: DEFINITIVE_PAS_SCHEMA.premium_rules }, null, 2);
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
