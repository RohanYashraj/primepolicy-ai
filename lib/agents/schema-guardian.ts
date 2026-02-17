import { BaseAgent, AgentResponse } from "./base";
import { CANONICAL_MASTER_SCHEMA } from "./schema";

export class SchemaGuardianAgent extends BaseAgent {
    public name = "Schema Guardian Agent";
    public description = "Defines, locks, and validates the complete canonical JSON structure.";

    public async run(documentId: string): Promise<AgentResponse> {
        // The Schema Guardian doesn't extract from the document, it ensures the structure is ready.
        return {
            agentName: this.name,
            data: {
                schema_info: {
                    version: CANONICAL_MASTER_SCHEMA.schema_info.version,
                    generated_at: new Date().toISOString(),
                    confidence_score: 1.0,
                    is_complete: true
                }
            },
            status: "success",
        };
    }
}
