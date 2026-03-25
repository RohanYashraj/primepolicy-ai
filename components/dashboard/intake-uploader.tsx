"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Zap, Terminal, Cpu, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function IntakeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "indexing" | "extracting" | "complete" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{ time: string, message: string }[]>([]);
  const [persistedFileName, setPersistedFileName] = useState<string | null>(null);

  // Load state from sessionStorage on mount
  useEffect(() => {
    const saved = sessionStorage.getItem("intake_state");
    if (saved) {
      try {
        const state = JSON.parse(saved);
        // If it was in progress, we reset to idle but keep logs/progress
        const resumedStatus = (state.status === "uploading" || state.status === "indexing" || state.status === "extracting")
          ? "idle"
          : state.status;

        setStatus(resumedStatus);
        setProgress(state.progress);
        setLogs(state.logs || []);
        setResults(state.results);
        setPersistedFileName(state.fileName);
      } catch (e) {
        console.error("Failed to hydrate intake state:", e);
      }
    }
  }, []);

  // Persist state to localStorage on any significant change
  useEffect(() => {
    const state = {
      status,
      progress,
      logs,
      results,
      fileName: file?.name || persistedFileName
    };

    // Only persist if there's actually something to save
    if (status !== "idle" || logs.length > 0 || file) {
      sessionStorage.setItem("intake_state", JSON.stringify(state));
    }
  }, [status, progress, logs, results, file, persistedFileName]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev.slice(-15), { time: timestamp, message: `> ${message}` }]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
      setError(null);
      setProgress(0);
      setLogs([]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus("uploading");
    setError(null);
    setProgress(5);
    setLogs([]);

    const addDelayedLog = (msg: string, delay: number) => {
      return new Promise(resolve => setTimeout(() => {
        addLog(msg);
        resolve(null);
      }, delay));
    };

    addLog("PROTOCOL INITIALIZED: STARTING STREAM...");
    addLog(`FILE ATTACHED: ${file.name.toUpperCase()}`);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulation steps for UX
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          const increment = prev < 30 ? 2 : (prev < 70 ? 1 : 0.5);
          return Math.min(prev + increment, 95);
        });
      }, 300);

      // Start sequential logs while waiting for API
      const logChain = async () => {
        await addDelayedLog("ESTABLISHING AGENT CONNECTION [SECURE LINK]...", 800);
        await addDelayedLog("SEMANTIC CHUNKING ENABLED // V4.2...", 1200);
        await addDelayedLog("ORCHESTRATOR: ASSIGNING SPECIALIST ZONES...", 1500);
        await addDelayedLog("INGESTING DATA INTO VECTOR STORE...", 1800);
        await addDelayedLog("AGENT-01: CLAIMS PARAMETERS IDENTIFIED...", 2200);
        await addDelayedLog("AGENT-02: RISK EXPOSURE ANALYSIS START...", 2500);
        await addDelayedLog("SENTIMENT NEURAL MAPPING IN PROGRESS...", 3000);
      };

      const fetchPromise = fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      // Run both but wait for fetch
      logChain();
      setStatus("indexing");
      const response = await fetchPromise;

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Failed to process document");
      }

      const data = await response.json();

      setProgress(100);
      addLog("EXTRACTION COMPLETE. SYNTHESIZING RESULTS...");
      addLog("SUCCESS: CONTRACT SCHEMAS VALIDATED.");
      addLog("REDIRECTION PROTOCOL ENGAGED // T-MINUS 2S");

      // Store results for Analysis/Artefacts pages
      sessionStorage.setItem("extraction_results", JSON.stringify(data.extraction));
      sessionStorage.setItem("extraction_filename", file.name);

      setResults(data);
      setStatus("complete");

      // Optional: Auto-navigate after a short delay
      setTimeout(() => {
        window.location.href = "/dashboard/artefacts";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
      setStatus("error");
      addLog(`CRITICAL FAILURE: ${err.message?.toUpperCase() || "SYSTEM ERROR"}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Input Control */}
        <div className={cn(
          "border border-border transition-all duration-500 p-8 flex flex-col items-center justify-center bg-card/5 group relative",
          status === "complete" ? "border-primary/50 shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]" : "hover:border-primary/20"
        )}>
          {/* Decorative Corner */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/20" />

          {!file && !persistedFileName ? (
            <div className="flex flex-col items-center text-center gap-6 py-12">
              <div className="w-16 h-16 bg-muted/30 flex items-center justify-center rounded-none border border-border group-hover:bg-primary/5 group-hover:border-primary/30 transition-all duration-500">
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold">Initialize Intake Protocol</p>
                <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest opacity-60">PDF Source Required // Max 20MB</p>
              </div>
              <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-8 w-full">
              <div className="w-full space-y-4">
                <div className="flex items-center gap-4 p-5 border border-border bg-background/50 backdrop-blur-sm w-full relative overflow-hidden group/file">
                  <div className="w-12 h-12 bg-primary/5 flex items-center justify-center border border-primary/10">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-mono text-[10px] font-bold truncate uppercase tracking-wider">{file?.name || persistedFileName}</p>
                    <p className="font-mono text-[9px] text-muted-foreground uppercase opacity-60">
                      {file ? (file.size / 1024 / 1024).toFixed(2) : "???"} MB // STATUS: {status === "idle" ? "READY" : status.toUpperCase()}
                    </p>
                  </div>
                  {status === "complete" ? (
                    <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in duration-500" />
                  ) : status === "error" ? (
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  ) : null}

                  {/* Shimmer Effect for active file */}
                  {isUploading && (
                    <div className="absolute bottom-0 left-0 h-[1px] bg-primary animate-progress-shimmer" style={{ width: '100%' }} />
                  )}
                </div>

                {/* Progress Bar Container */}
                {(status !== "idle" && status !== "error") && (
                  <div className="space-y-2 pt-2 text-left">
                    <div className="flex justify-between font-mono text-[9px] uppercase tracking-widest">
                      <span className="text-primary/70">{status === "complete" ? "Extraction Verified" : "Agent Synthesis active"}</span>
                      <span className="text-primary font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-muted/20 overflow-hidden border border-border/50">
                      <div
                        className="h-full bg-primary transition-all duration-300 ease-out relative"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {status === "idle" && (
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="rounded-none font-mono uppercase tracking-[0.2em] px-12 h-14 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Execute Analysis <Zap className="w-3 h-3" />
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              )}

              {status === "complete" && (
                <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="p-5 bg-primary/5 border border-primary/20 relative">
                    <div className="absolute top-0 right-0 w-2 h-2 bg-primary/20" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Extraction Successful</p>
                    <p className="text-[9px] text-muted-foreground font-mono mt-2 uppercase tracking-widest leading-relaxed">
                      Protocol complete. Validating output schema across {results?.extraction?.length || 0} zones.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setStatus("idle");
                      setResults(null);
                      setProgress(0);
                      setLogs([]);
                      setPersistedFileName(null);
                      sessionStorage.removeItem("intake_state");
                    }}
                    className="rounded-none font-mono uppercase tracking-[0.2em] px-8 h-10 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  >
                    Reset Terminal
                  </Button>
                </div>
              )}

              {status === "error" && (
                <div className="space-y-6 w-full text-left animate-in fade-in duration-500">
                  <div className="p-5 bg-destructive/5 border border-destructive/20 flex gap-4">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-destructive font-bold">Protocol Failure</p>
                      <p className="text-[9px] text-destructive-foreground/70 font-mono mt-2 uppercase leading-relaxed">{error}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatus("idle");
                      setProgress(0);
                      setLogs([]);
                      setFile(null);
                      setPersistedFileName(null);
                      sessionStorage.removeItem("intake_state");
                    }}
                    className="rounded-none font-mono uppercase tracking-[0.2em] px-10 h-10 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  >
                    Retry Protocol
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Information Log / Terminal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60 px-2">
            <span className="flex items-center gap-2 text-black/70">
              <Terminal className="w-3 h-3 text-primary" />
              Information Log
            </span>
            <span className="flex items-center gap-1.5 grayscale opacity-70">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              LIVE_STREAM
            </span>
          </div>

          <div className="border border-border bg-[#0a0a0a] p-5 font-mono text-[10px] h-[220px] lg:h-[280px] overflow-y-auto scrollbar-industrial relative group shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20" />

            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-30 group-hover:opacity-60 transition-opacity duration-700">
                  <Cpu className="w-6 h-6 mb-1 text-primary/50" />
                  <p className="uppercase tracking-[0.3em] text-[8px] text-white/80">System Standby...</p>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-1 duration-300">
                    <span className="text-primary/40 shrink-0 select-none">[{log.time}]</span>
                    <span className={cn(
                      "leading-relaxed tracking-wide",
                      log.message.includes("FAILURE") ? "text-destructive font-bold" :
                        log.message.includes("SUCCESS") || log.message.includes("COMPLETE") ? "text-primary font-bold" :
                          "text-white"
                    )}>
                      {log.message}
                    </span>
                  </div>
                ))
              )}
              {isUploading && (
                <div className="flex gap-3 items-center pt-1">
                  <span className="text-primary/30 shrink-0">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span className="text-primary animate-pulse">_</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border border-border/50 bg-card/5 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] text-muted-foreground font-mono uppercase tracking-widest">Protocol</span>
                <span className="text-[9px] text-primary/80 font-mono font-bold tracking-widest">V4.2.0</span>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="flex flex-col gap-1">
                <span className="text-[8px] text-muted-foreground font-mono uppercase tracking-widest">Nodes</span>
                <span className="text-[9px] text-primary/80 font-mono font-bold tracking-widest">ACTIVE [10]</span>
              </div>
            </div>
            <Layers className="w-4 h-4 text-primary/10" />
          </div>
        </div>
      </div>

      {/* Decorative Grid Lines */}
      <div className="grid grid-cols-4 gap-4 opacity-10 pointer-events-none pt-4">
        <div className="h-px bg-border text-center" />
        <div className="h-px bg-border" />
        <div className="h-px bg-border" />
        <div className="h-px bg-border" />
      </div>
    </div>
  );
}
