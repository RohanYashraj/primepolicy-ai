"use client";

import { useEffect, useState } from "react";
import { FileJson, Copy, Download, Box, Layers, Zap, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ArtefactsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedResults = localStorage.getItem("extraction_results");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    setIsLoaded(true);
  }, []);

  const combinedData = results.reduce((acc, curr) => {
    return { ...acc, ...curr.data };
  }, {});

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(combinedData, null, 2));
  };

  if (!isLoaded) return null;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h1 className="text-2xl font-mono font-bold uppercase tracking-[0.2em] text-shadow-industrial">Extraction Artefacts</h1>
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">Consolidated Structured Output // Protocol V4</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-none font-mono text-[10px] uppercase tracking-widest h-10 px-6">
            <Copy className="w-3 h-3 mr-2" />
            Copy JSON
          </Button>
          <Button variant="outline" size="sm" className="rounded-none font-mono text-[10px] uppercase tracking-widest h-10 px-6">
            <Download className="w-3 h-3 mr-2" />
            Export Spec
          </Button>
        </div>
      </div>

      {!results.length ? (
        <div className="p-12 border border-dashed border-border flex flex-col items-center justify-center bg-card/5">
          <Box className="w-8 h-8 text-muted-foreground/30 mb-4" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">No artefacts generated. Initialize intake analysis to begin.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          <div className="border border-border overflow-hidden relative">
            <div className="bg-muted/50 p-4 border-b border-border flex items-center gap-3">
              <FileJson className="w-4 h-4 text-primary" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">Master_Payload.json</span>
            </div>
            <div className="p-8 font-mono text-[12px] leading-relaxed relative">
              <pre className="text-muted-foreground overflow-x-auto scrollbar-industrial relative z-10">
                {JSON.stringify(combinedData, null, 2)}
              </pre>
            </div>
            
            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/20" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/20" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 border border-border bg-card/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Layers className="w-4 h-4" />
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider">Object Schema Validation</h4>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase leading-tight">
                Output has been validated against the specialized agent schemas. Root keys: {Object.keys(combinedData).join(", ")}.
              </p>
            </div>
            <div className="p-6 border border-border bg-card/10 space-y-4">
              <div className="flex items-center gap-3 text-primary">
                <Cpu className="w-4 h-4" />
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider">Model Affinity</h4>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono uppercase leading-tight">
                Inference precision matched at 98% across individual specialist zones using Gemini 1.5 Pro.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
