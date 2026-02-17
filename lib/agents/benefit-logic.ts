import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class BenefitLogicAgent extends BaseAgent {
    public name = "Benefit Logic Agent";
    public description = "Owner of benefit_configuration domain with deterministic payout logic.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract benefit types, payout precedence (higher of, sum of), calculation components, vesting conditions, and dependencies.");

            const prompt = `Map benefits into deterministic configuration objects.
      - precedence: 'higher_of', 'sum_of', 'lower_of', or 'first_occurrence'.
      - calculation_components: basis (sum_assured, etc.), multiplier, fixed_addition, cap, floor.
      - vesting_conditions: duration and premiums paid thresholds.
      - waiting_period: duration and unit.
      - dependencies: related or invalidated benefits.
      Convert all rules into machine-executable parameters. No narrative descriptions.`;

            const schema = JSON.stringify({ benefit_configuration: DEFINITIVE_PAS_SCHEMA.benefit_configuration }, null, 2);
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
