import { BaseAgent, AgentResponse } from "./base";

export class MetadataAgent extends BaseAgent {
    public name = "Product Metadata Agent";
    public description = "Extracts high-level product identification data (Name, LOB, Version)";

    public async run(documentId: string): Promise<AgentResponse> {
        try {
            // 1. Retrieval
            const context = await this.getContext("Extract product name, line of business, and version number from this insurance specification.");

            // 2. Extraction
            const prompt = "Identify the Product Name, Line of Business (LOB), and the version or release date of this spec.";
            const schema = `
        {
          "productName": "string",
          "lineOfBusiness": "string",
          "version": "string | null",
          "effectiveDate": "string | null"
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
