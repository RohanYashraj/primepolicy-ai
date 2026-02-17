import { BaseAgent, AgentResponse } from "./base";
import { DEFINITIVE_PAS_SCHEMA } from "./schema";

export class SchemaGuardianAgent extends BaseAgent {
    public name = "Schema Guardian Agent";
    public description = "Owner of product_context identity and global structure validation.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract product canonical ID, name, family, variant code, and carrier legal/entity details.");

            const prompt = `Extract global product identity and carrier information.
      - canonical_product_id: Create a unique slug.
      - product_name: Full marketing name.
      - product_family: e.g., 'Individual Life', 'Group Health'.
      - variant_code: internal code if present.
      - carrier: legal_name and entity_code.
      Strictly follow the JSON structure provided.`;

            const schema = JSON.stringify({
                product_context: {
                    canonical_product_id: DEFINITIVE_PAS_SCHEMA.product_context.canonical_product_id,
                    product_name: DEFINITIVE_PAS_SCHEMA.product_context.product_name,
                    product_family: DEFINITIVE_PAS_SCHEMA.product_context.product_family,
                    variant_code: DEFINITIVE_PAS_SCHEMA.product_context.variant_code,
                    carrier: DEFINITIVE_PAS_SCHEMA.product_context.carrier
                }
            }, null, 2);

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
