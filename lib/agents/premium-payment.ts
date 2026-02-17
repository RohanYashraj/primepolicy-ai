import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class PremiumPaymentAgent extends BaseAgent {
    public name = "Pricing & Premium Agent";
    public description = "Extracts premium modes, calculation basis, and grace periods.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract payment modes, frequencies, grace periods, and calculation rating factors.");

            const prompt = `Extract deterministic premium rules.
            - payment_modes and frequencies_allowed.
            - grace_period_days as a number.
            - calculation_basis: table_ref, fixed_rate, and list of factors.
            Values must be directly ingestible by a rating engine.`;

            const schema = JSON.stringify(PAS_EXECUTABLE_SCHEMA.premium_rules, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { premium_rules: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
