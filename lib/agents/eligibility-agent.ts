import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class EligibilityAgent extends BaseAgent {
    public name = "Eligibility Agent";
    public description = "Owner of eligibility domain.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext(documentId, "Extract entry age bounds, maturity age bounds, financial sum assured limits, and policy term constraints.");

            const prompt = `Extract entry ages, maturity ages, financial limits (SA bounds), and policy term constraints.
      - entry_age_min: minimum entry age.
      - entry_age_max: maximum entry age.
      - maturity_age_max: maximum maturity age.
      - minimum_sum_assured: minimum allowed sum assured.
      - maximum_sum_assured: maximum allowed sum assured.
      - policy_term_min_years: minimum policy term length in years.
      - policy_term_max_years: maximum policy term length in years.
      Ensure all numerical outputs are pure numbers. Use null if not available. Strictly follow the DEFINITIVE_PAS_SCHEMA.eligibility structure.`;

            const schema = JSON.stringify({ eligibility: DEFINITIVE_PAS_SCHEMA.eligibility }, null, 2);
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
