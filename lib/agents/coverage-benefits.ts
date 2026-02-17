import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class CoverageBenefitsAgent extends BaseAgent {
    public name = "Benefit Logic Agent";
    public description = "Encodes payout triggers and calculation precedence (e.g., higher of, sum of).";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract benefit payout logic, calculation precedence (higher of, etc.), vesting conditions, and payout triggers.");

            const prompt = `Encode benefit configuration into machine-executable rules.
            - precedence: 'higher_of', 'sum_of', 'lower_of', or 'first_occurence'.
            - components: List of basis fields (sum_assured, etc.) and multipliers.
            - vesting_condition: period and threshold.
            - payout_triggers: list of event slugs ('death', etc.).
            No narrative text; focus on mathematical relationships.`;

            const schema = JSON.stringify(PAS_EXECUTABLE_SCHEMA.benefit_configuration, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { benefit_configuration: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
