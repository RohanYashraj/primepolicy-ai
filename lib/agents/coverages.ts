import { BaseAgent, AgentResponse } from "./base";

export class CoverageAgent extends BaseAgent {
    public name = "Coverage Specialist Agent";
    public description = "Extracts detailed coverage information, including limits and deductibles.";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            // 1. Retrieval
            const context = await this.getContext("Extract all coverage types, their respective limits, and deductibles from this policy specification.");

            // 2. Extraction
            const prompt = "Identify all coverages listed. For each coverage, extract the Coverage Name, the Limit, and the Deductible or Co-insurance.";
            const schema = `
        {
          "coverages": [
            {
              "name": "string",
              "limit": "string | null",
              "deductible": "string | null"
            }
          ]
        }
      `;

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
