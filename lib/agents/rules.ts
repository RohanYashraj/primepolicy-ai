import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class RuleAgent extends BaseAgent {
    public name = "Policy Rule Agent";
    public description = "Extracts exclusions, limitations, and administrative compliance rules.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract policy exclusions, limitations, claims notice windows, and contact info.");

            const prompt = `Identify the key rules and limitations of this policy.
            Focus on creating short, categorizable entries for the database.
            - limitations_exclusions: Group by category. Provide a short_name (e.g., 'War Exclusion') and impact_level. 
            - is_absolute: set to true if the exclusion has no carve-outs or exceptions.
            - compliance_admin: reporting window (days), contact type, and details. AVOID long text in details.`;

            const schema = JSON.stringify({
                limitations_exclusions: MASTER_SCHEMA.limitations_exclusions,
                compliance_admin: MASTER_SCHEMA.compliance_admin
            }, null, 2);

            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data,
                status: "success",
            };
        } catch (error: any) {
            return {
                agentName: this.name,
                data: null,
                status: "error",
                message: error.message,
            };
        }
    }
}
