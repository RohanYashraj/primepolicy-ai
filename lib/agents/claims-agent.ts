import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class ClaimsAgent extends BaseAgent {
    public name = "Claims Agent";
    public description = "Owner of claims_administration domain (events and timelines).";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract claim event types, notification timelines, documentation requirements, and settlement SLAs.");

            const prompt = `Translate claims procedures into deterministic system data.
      - claim_event_types: death_claim, maturity_claim, etc.
      - notification_requirements: timeline_days and modes (online/offline).
      - documentation_required: list of documents.
      - settlement_sla_days: numeric SLA.
      Strictly follow the defined keys.`;

            const schema = JSON.stringify({ claims_administration: DEFINITIVE_PAS_SCHEMA.claims_administration }, null, 2);
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
