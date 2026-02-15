import { IntakeUploader } from "@/components/dashboard/intake-uploader";

export default function IntakePage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-2xl font-mono font-bold uppercase tracking-[0.2em] text-shadow-industrial">Product Intake</h1>
        <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest max-w-xl leading-relaxed">
          Upload insurance product specification documents (PDF) to initiate the agentic extraction protocol. Submissions are semantically indexed into the vector database for high-fidelity conversion.
        </p>
      </div>

      <div className="p-8 border border-border bg-card/10 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-muted-foreground/30 uppercase tracking-[0.4em]">Section // Intake</div>
        <IntakeUploader />
      </div>

      <div className="grid md:grid-cols-3 gap-6 pt-12 border-t border-border">
        <div className="space-y-2">
          <div className="h-0.5 w-8 bg-primary/40" />
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider">Protocol V4.2</h4>
          <p className="text-[10px] text-muted-foreground font-mono uppercase leading-tight">Semantic chunking enabled with metadata persistence.</p>
        </div>
        <div className="space-y-2">
          <div className="h-0.5 w-8 bg-primary/40" />
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider">Agent Sync</h4>
          <p className="text-[10px] text-muted-foreground font-mono uppercase leading-tight">Orchestrator monitoring specialist availability in all zones.</p>
        </div>
        <div className="space-y-2">
          <div className="h-0.5 w-8 bg-primary/40" />
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider">Vector Store</h4>
          <p className="text-[10px] text-muted-foreground font-mono uppercase leading-tight">Supabase pgvector connection status: Optimal.</p>
        </div>
      </div>
    </div>
  );
}
