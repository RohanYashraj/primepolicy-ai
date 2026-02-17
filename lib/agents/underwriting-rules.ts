import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class UnderwritingRulesAgent extends BaseAgent {
    public name = "Underwriting Rules Agent";
    public description = "Specifies risk evaluation requirements, evidence thresholds, and decision gates.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract underwriting rules, evidence requirements (medical/financial), auto-approval thresholds, and referral triggers.");

            const prompt = `Identify deterministic underwriting gates.
            - List of evidence requirements.
            - Auto-approval thresholds (max sum assured).
            - List of referral triggers.
            Machine-enforceable fields only. Exclude narrative descriptions.`;

            const schema = JSON.stringify(CANONICAL_MASTER_SCHEMA.underwriting_gates, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { underwriting_gates: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
