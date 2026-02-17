import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class EligibilityAgent extends BaseAgent {
    public name = "Eligibility Agent";
    public description = "Extracts entry age, residency, occupation, and participation rules.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract age limits, residency requirements, occupation classes, participation rules (employees/assets), and exclusionary conditions.");

            const prompt = `Extract deterministic eligibility rules.
            - Age limits: min/max and unit.
            - Lists of residency requirements and occupation classes.
            - Participation: min employees, min assets, mandatory membership (boolean).
            - List of exclusionary conditions.
            Use machine-ready fields, no narrative text.`;

            const schema = JSON.stringify(CANONICAL_MASTER_SCHEMA.eligibility_engine, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { eligibility_engine: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
