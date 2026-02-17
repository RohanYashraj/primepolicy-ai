import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class ValidationAuditAgent extends BaseAgent {
    public name = "Validation & Audit Agent";
    public description = "Ensures every schema field is populated with a value or explicitly set to null/not_available.";

    public async run(documentId: string): Promise<AgentResponse> {
        // This agent runs after others in a real scenario, but here we provide a mechanism.
        // It will inspect the contexts for missing data.
        try {
            const context = await this.getContext("Perform a scan for any field that might be missing or explicitly 'not available' in the document.");

            const prompt = `Audit the extraction potential for all fields in the canonical schema.
            For each field path, identify if the value is likely to be 'populated', 'null', or 'not_available' based on the document source.
            Return a list of field_metadata objects.`;

            const schema = JSON.stringify(CANONICAL_MASTER_SCHEMA.audit_validation, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { audit_validation: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
