import { BaseAgent, AgentResponse } from "./base";
import { MASTER_SCHEMA } from "./schema";

export class FeatureAgent extends BaseAgent {
    public name = "Product Feature Agent";
    public description = "Extracts the structured product features including limits, retentions, and sub-features.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            const context = await this.getContext("Extract all product coverages, features, limits, deductibles, and retentions.");

            const prompt = `Map the insurance product structure into a list of features.
            For each feature:
            - feature_id: a unique slugified name (e.g., 'professional-indemnity', 'cyber-extortion')
            - feature_label: the human-readable name
            - value_type: identifies if it's a 'limit', 'retention', 'waiting_period', or simple 'boolean' flag
            - numeric_value: the specific amount or duration (provide ONLY the number)
            - unit: the measurement unit (USD, days, percent, boolean)
            - applies_per: 'claim', 'aggregate', or 'event'
            - is_optional: true if it's an optional endorsement, otherwise false
            - sub_features: any specific granular limits or flags under this main feature (e.g., 'Crisis Management sub-limit')
            
            AVOID long descriptions. Focus on precision and data-entry readiness.`;

            const schema = JSON.stringify({
                product_features: MASTER_SCHEMA.product_features
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
