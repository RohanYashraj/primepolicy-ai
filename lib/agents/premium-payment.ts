import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class PremiumPaymentAgent extends BaseAgent {
    public name = "Premium & Payment Agent";
    public description = "Defines premium calculation basis, payment modes, frequencies, and grace periods.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract premium calculation basis, rating factors, payment modes, frequencies, and grace periods.");

            const prompt = `Extract structured premium and payment data.
            - Calculation: method, factors (list).
            - Modes (manual/automatic), Frequencies (monthly, etc.).
            - Grace period: duration, unit.
            No paraphrasing or text descriptions.`;

            const schema = JSON.stringify(CANONICAL_MASTER_SCHEMA.premium_payment, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { premium_payment: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
