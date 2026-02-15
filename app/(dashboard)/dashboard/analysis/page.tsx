"use client";

import { useEffect, useState } from "react";
import { Terminal, Shield, Database, Cpu, Search, CheckCircle2 } from "lucide-react";

export default function AnalysisPage() {
  const [results, setResults] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedResults = localStorage.getItem("extraction_results");
    const storedFileName = localStorage.getItem("extraction_filename");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    if (storedFileName) {
      setFileName(storedFileName);
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="space-y-2">
        <h1 className="text-2xl font-mono font-bold uppercase tracking-[0.2em] text-shadow-industrial">Protocol Analysis</h1>
        <div className="flex items-center gap-4">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Source Document: <span className="text-primary font-bold">{fileName || "UNKNOWN_SOURCE"}</span></p>
          <div className="h-3 w-px bg-border" />
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Status: <span className="text-primary font-bold">Extraction Complete</span></p>
        </div>
      </div>

      {!results.length ? (
        <div className="p-12 border border-dashed border-border flex flex-col items-center justify-center bg-card/5">
          <Terminal className="w-8 h-8 text-muted-foreground/30 mb-4" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">No active analysis session found. Please initialize intake.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {results.map((agent, idx) => (
            <div key={idx} className="border border-border relative overflow-hidden group">
              {/* Agent Header */}
              <div className="bg-muted/50 p-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {agent.agentName.includes("Metadata") ? (
                    <Database className="w-4 h-4 text-primary" />
                  ) : (
                    <Shield className="w-4 h-4 text-primary" />
                  )}
                  <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest">{agent.agentName}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-[8px] uppercase tracking-tighter text-muted-foreground font-medium">Status: {agent.status}</span>
                </div>
              </div>

              {/* Console Output */}
              <div className="p-6 font-mono text-[11px] space-y-4">
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">[RETR]</span>
                    <span>Initializing RAG queries for target domain...</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">[VEC]</span>
                    <span>Scanning Supabase pgvector for top-5 candidates...</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-primary font-bold">[EXTR]</span>
                    <span>Context retrieved. Processing via Gemini 1.5 Pro...</span>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/10 rounded-sm">
                  <div className="flex items-center gap-2 mb-3 text-primary">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="font-bold uppercase tracking-tighter">Extraction Results</span>
                  </div>
                  <pre className="text-foreground font-medium whitespace-pre-wrap break-all overflow-x-auto scrollbar-industrial">
                    {JSON.stringify(agent.data, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Decorative side accent */}
              <div className="absolute top-0 right-0 h-full w-1 bg-primary/20" />
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-8 border-t border-border flex justify-between items-center text-muted-foreground/60">
        <p className="font-mono text-[8px] uppercase tracking-[0.2em]">End of Analysis Stream // System-128</p>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            <span className="font-mono text-[8px] uppercase tracking-tighter text-foreground/80">Agents: 02</span>
          </div>
          <div className="flex items-center gap-2">
            <Search className="w-3 h-3" />
            <span className="font-mono text-[8px] uppercase tracking-tighter text-foreground/80">RAG Score: 0.94</span>
          </div>
        </div>
      </div>
    </div>
  );
}
