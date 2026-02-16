import { NextRequest, NextResponse } from "next/server";
import { AgentOrchestrator } from "@/lib/agents/orchestrator";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;

    const orchestrator = new AgentOrchestrator();

    // 1. Ingest (Index)
    console.log(`Ingesting document: ${fileName}`);
    const ingestResult = await orchestrator.ingestDocument(buffer, fileName);

    // 2. Extract
    console.log(`Executing agents for: ${fileName}`);
    const extractionResults = await orchestrator.executeExtraction(fileName);

    return NextResponse.json({
      success: true,
      ingest: ingestResult,
      extraction: extractionResults,
    });
  } catch (error: any) {
    console.error("Extraction error:", error);
    return NextResponse.json(
      {
        error: "Internal server error during extraction",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
