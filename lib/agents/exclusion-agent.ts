import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class ExclusionAgent extends BaseAgent {
    public name = "Exclusion Agent";
    public description = "Owner of exclusions domain.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext(documentId, "Extract policy exclusions, descriptions, and applicable periods.");

            const prompt = `Map policy exclusions.
      - description: Brief description of the exclusion.
      - applicable_period_months: Number of months it applies, or null if permanent.
      Strictly follow the DEFINITIVE_PAS_SCHEMA.exclusions structure.`;

            const schema = JSON.stringify({ exclusions: DEFINITIVE_PAS_SCHEMA.exclusions }, null, 2);
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
