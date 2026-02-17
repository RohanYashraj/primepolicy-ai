import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class ExclusionsLimitationsAgent extends BaseAgent {
    public name = "Strict Exclusion Agent";
    public description = "Maps exclusions into deterministic system-enforceable rules.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract policy exclusions, condition precedents, and restrictive periods.");

            const prompt = `Map policy exclusions into deterministic rule objects.
            - exclusion_id: unique slug.
            - scope: 'full' or 'limited'.
            - condition_precedent: A machine-readable string describing the trigger.
            - period_months: Duration of the exclusion.
            Exclude all descriptive/narrative context.`;

            const schema = JSON.stringify(PAS_EXECUTABLE_SCHEMA.exclusion_rules, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { exclusion_rules: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
