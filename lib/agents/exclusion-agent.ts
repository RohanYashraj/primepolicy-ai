import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class ExclusionAgent extends BaseAgent {
    public name = "Exclusion Agent";
    public description = "Owner of exclusion_rules domain (machine-readable triggers).";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract policy exclusions, machine-readable triggers, and impact on benefits.");

            const prompt = `Map exclusions into deterministic system rules.
      - exclusion_id: Unique slug.
      - scope: full | limited.
      - condition_precedent: A machine-readable logical string (e.g., 'event.cause == suicide && policy.age < 12m').
      - applicable_duration_months: Number.
      - impact_on_benefits: deny | reduce | defer.
      No narrative text allowed.`;

            const schema = JSON.stringify({ exclusion_rules: DEFINITIVE_PAS_SCHEMA.exclusion_rules }, null, 2);
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
