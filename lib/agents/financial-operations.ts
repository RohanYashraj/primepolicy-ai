import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class FinancialOperationsAgent extends BaseAgent {
    public name = "Financial Operations Agent";
    public description = "Extracts loans, bonuses, and interest rate logic.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract policy loan availability, interest rates, bonus types (reversionary, terminal), and vesting rules.");

            const prompt = `Extract deterministic financial operation parameters.
            - loans: available (boolean), max_loan_percent_of_value, and interest_rate_percent.
            - bonuses: types (list) and vesting_rules.
            Identify numerical rates and explicit types only.`;

            const schema = JSON.stringify({
                policy_lifecycle: {
                    loans: PAS_EXECUTABLE_SCHEMA.policy_lifecycle.loans,
                    bonuses: PAS_EXECUTABLE_SCHEMA.policy_lifecycle.bonuses
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
