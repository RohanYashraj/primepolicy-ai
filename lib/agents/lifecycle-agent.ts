import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class LifecycleAgent extends BaseAgent {
    public name = "Lifecycle Agent";
    public description = "Owner of policy_lifecycle and bonuses.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext(documentId, "Extract lapse conditions, revival window, paid-up logic, surrender availability, loan limits, and bonus details.");

            const prompt = `Extract deterministic lifecycle rules.
      - lapse_condition: Description of the lapse condition.
      - revival_period_months: Revival period in months.
      - paid_up_allowed: whether paid up is allowed (boolean).
      - surrender_allowed: whether surrender is allowed (boolean).
      - loan_available: whether a loan is available (boolean).
      - bonuses: extraction of bonus_types (e.g., 'reversionary', 'terminal') and description.
      Strictly follow DEFINITIVE_PAS_SCHEMA.policy_lifecycle and DEFINITIVE_PAS_SCHEMA.bonuses structures.`;

            const schema = JSON.stringify({
                policy_lifecycle: DEFINITIVE_PAS_SCHEMA.policy_lifecycle,
                bonuses: DEFINITIVE_PAS_SCHEMA.bonuses
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
