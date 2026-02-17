import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class UnderwritingAgent extends BaseAgent {
    public name = "Underwriting Agent";
    public description = "Owner of underwriting_rules domain (decision gates and evidence).";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract evidence requirements, auto-underwriting limits/conditions, and referral triggers.");

            const prompt = `Identify deterministic underwriting gates.
      - evidence_requirements: List (kyc, financials, medical_tests, etc.).
      - auto_underwriting: is_enabled (boolean), max_sum_assured (number), eligibility_conditions.
      - referral_rules: trigger_condition (logical expression) and reason.
      Machine-enforceable fields only.`;

            const schema = JSON.stringify({ underwriting_rules: DEFINITIVE_PAS_SCHEMA.underwriting_rules }, null, 2);
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
