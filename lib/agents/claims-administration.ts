import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class ClaimsAdministrationAgent extends BaseAgent {
    public name = "Claims Administration Agent";
    public description = "Defines claim events, documentation requirements, and settlement timelines.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract claimable event definitions, reporting timelines, required documentation, and settlement SLA (days to pay).");

            const prompt = `Translate claims procedures into deterministic system data.
            - List of event definitions.
            - Reporting timeline (max days and format).
            - List of required documentations.
            - Settlement SLA (days).
            Do not paraphrase; use explicit values only.`;

            const schema = JSON.stringify(CANONICAL_MASTER_SCHEMA.claims_administration, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { claims_administration: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
