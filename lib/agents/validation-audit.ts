import { BaseAgent, AgentResponse } from "./base";
import { PAS_EXECUTABLE_SCHEMA } from "./schema";

export class ValidationAuditAgent extends BaseAgent {
    public name = "Integrity & Validation Agent";
    public description = "Ensures population integrity and records confidence levels for all fields.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Audit the document for potential missing rules or ambiguous financial terms.");

            const prompt = `Audit the extraction integrity.
            For each section of the PAS-executable schema, identify the population state.
            - path: JSON path to the field.
            - state: 'populated', 'not_available', or 'null'.
            - confidence: numeric value (0-1).
            Provide a machine-readable audit report.`;

            const schema = JSON.stringify(PAS_EXECUTABLE_SCHEMA.audit_and_integrity, null, 2);
            const data = await this.extract<any>(context, prompt, schema);

            return {
                agentName: this.name,
                data: { audit_and_integrity: data },
                status: "success",
            };
        } catch (error: any) {
            return { agentName: this.name, data: null, status: "error", message: error.message };
        }
    }
}
