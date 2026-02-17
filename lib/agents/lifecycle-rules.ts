import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class LifecycleRulesAgent extends BaseAgent {
    public name = "Lifecycle Rules Agent";
    public description = "Extracts surrender, paid-up, and revival deterministic logic.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract surrender rules, paid-up eligibility, and revival interest rates/periods.");

            const prompt = `Extract policy lifecycle rules as deterministic logic.
            - surrender: is_allowed, min period, and calculation factors.
            - paid_up: is_eligible, min premiums, and value_formula.
            - revival: allowed period, interest basis (compound/simple), and rate percent.
            Translate clauses into system-ready parameters.`;

            const schema = JSON.stringify(PAS_EXECUTABLE_SCHEMA.policy_lifecycle, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { policy_lifecycle: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
