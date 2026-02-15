"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function IntakeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "indexing" | "extracting" | "complete" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Step 1: Upload & Ingest
      setStatus("indexing");
      const response = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process document");
      }

      const data = await response.json();
      
      // Store results for Analysis/Artefacts pages
      localStorage.setItem("extraction_results", JSON.stringify(data.extraction));
      localStorage.setItem("extraction_filename", file.name);
      
      setResults(data);
      setStatus("complete");
      
      // Optional: Auto-navigate after a short delay
      setTimeout(() => {
        window.location.href = "/dashboard/analysis";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className={cn(
        "border-2 border-dashed transition-colors p-12 flex flex-col items-center justify-center bg-card/10 group",
        status === "complete" ? "border-primary/50" : "border-border hover:border-primary/30"
      )}>
        {!file ? (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 bg-muted flex items-center justify-center rounded-none border border-border group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors">
              <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">Initialize Intake Protocol</p>
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Drag specification document or click to browse</p>
            </div>
            <input
              type="file"
              accept=".pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-6 w-full">
            <div className="flex items-center gap-4 p-4 border border-border bg-background w-full">
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="font-mono text-xs font-bold truncate uppercase">{file.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground uppercase opacity-60">{(file.size / 1024 / 1024).toFixed(2)} MB // PDF SOURCE</p>
              </div>
              {status === "complete" && <CheckCircle2 className="w-5 h-5 text-primary" />}
            </div>

            {status === "idle" && (
              <Button 
                onClick={handleUpload} 
                className="rounded-none font-mono uppercase tracking-[0.2em] px-8 h-12"
              >
                Execute Analysis
              </Button>
            )}

            {(status === "uploading" || status === "indexing" || status === "extracting") && (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary animate-pulse">
                  {status === "indexing" ? "Semantic Indexing in Progress..." : "Processing Data Stream..."}
                </p>
              </div>
            )}

            {status === "complete" && (
              <div className="space-y-4 w-full">
                <div className="p-4 bg-primary/5 border border-primary/20">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold">Operation Successful</p>
                  <p className="text-[10px] text-muted-foreground font-mono mt-1">Extraction artifacts generated across {results?.extraction?.length || 0} specialist zones.</p>
                </div>
                <Button variant="outline" onClick={() => { setFile(null); setStatus("idle"); setResults(null); }} className="rounded-none font-mono uppercase tracking-[0.2em] px-8">
                  Reset Terminal
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4 w-full text-left">
                <div className="p-4 bg-destructive/10 border border-destructive/20 flex gap-3">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-destructive font-bold">Protocol Failure</p>
                    <p className="text-[10px] text-destructive-foreground font-mono mt-1">{error}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setStatus("idle")} className="rounded-none font-mono uppercase tracking-[0.2em] px-8">
                  Retry Protocol
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Decorative Grid Lines */}
      <div className="grid grid-cols-4 gap-4 opacity-10 pointer-events-none">
        <div className="h-px bg-border" />
        <div className="h-px bg-border" />
        <div className="h-px bg-border" />
        <div className="h-px bg-border" />
      </div>
    </div>
  );
}
