import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class ExclusionsLimitationsAgent extends BaseAgent {
    public name = "Exclusions & Limitations Agent";
    public description = "Maps exclusions into deterministic system rules with applicability and impact.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract all exclusions, restrictive clauses, impact (full exclusion/reduction), and applicability conditions.");

            const prompt = `Map exclusions into machine-readable rules.
            - Rule ID, category, impact type.
            - Applicability condition.
            - is_absolute flag (boolean).
            Exclude irrelevant descriptive text.`;

            const schema = JSON.stringify(CANONICAL_MASTER_SCHEMA.exclusions_limitations, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { exclusions_limitations: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
