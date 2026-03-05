import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class BenefitLogicAgent extends BaseAgent {
    public name = "Benefit Logic Agent";
    public description = "Owner of benefits domain.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext(documentId, "Extract benefit types, description, payout formulas, and waiting periods.");

            const prompt = `Map policy benefits.
      - benefit_type: death | maturity | survival | disability | critical_illness
      - description: Brief description of the benefit.
      - payout_formula: Description or formula for the payout amount.
      - waiting_period: Any applicable waiting period, or null.
      Strictly follow the DEFINITIVE_PAS_SCHEMA.benefits structure.`;

            const schema = JSON.stringify({ benefits: DEFINITIVE_PAS_SCHEMA.benefits }, null, 2);
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
