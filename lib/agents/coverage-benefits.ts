import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class CoverageBenefitsAgent extends BaseAgent {
    public name = "Coverage & Benefits Agent";
    public description = "Encodes sum assured structures, benefit triggers, payout logic, limits, and dependencies.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract all coverages, benefit triggers, payout logic (fixed/indemnity), limits, deductibles, retentions, and waiting periods.");

            const prompt = `Map the document's benefits into deterministic coverage objects.
            For each benefit:
            - unique slug ID and label.
            - trigger event and payout logic (type, basis, limit, currency).
            - Deductibles/Retentions (amount, type, is_aggregate).
            - Waiting period (duration, unit).
            - Sub-limits and Dependencies.
            Strict machine fields only. No narrative.`;

            const schema = JSON.stringify(CANONICAL_MASTER_SCHEMA.coverage_benefits, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { coverage_benefits: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
