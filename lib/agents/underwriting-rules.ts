import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class UnderwritingRulesAgent extends BaseAgent {
    public name = "Underwriting Gate Agent";
    public description = "Specifies risk evaluation requirements and decision threshold gates.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract underwriting input requirements, auto-pass limits, and referral triggers.");

            const prompt = `Identify deterministic underwriting decision gates.
            - gate_ref: A unique slug.
            - input_requirements: List of evidence types.
            - auto_pass_limit: Numerical sum assured limit.
            - referral_trigger_condition: Machine-readable trigger logic.`;

            const schema = JSON.stringify(PAS_EXECUTABLE_SCHEMA.underwriting_decision_gates, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { underwriting_decision_gates: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
