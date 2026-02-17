import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class LifecycleAgent extends BaseAgent {
    public name = "Lifecycle Agent";
    public description = "Owner of policy_lifecycle_rules (surrender, revival, loans, etc.).";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract lapse conditions, revival window/interest, paid-up logic, surrender calculation, loan limits, and bonus accruals.");

            const prompt = `Extract deterministic lifecycle rules.
      - lapse/revival: conditions, window, interest rate/type.
      - paid_up: is_allowed, min premiums, and formula.
      - surrender: is_allowed, min period, and factors (guaranteed/special).
      - loans: availability, max percentage, interest rate.
      - bonuses: types, accrual, and vesting rules.
      Translate clauses into executable formulas or numeric factors.`;

            const schema = JSON.stringify({ policy_lifecycle_rules: DEFINITIVE_PAS_SCHEMA.policy_lifecycle_rules }, null, 2);
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
