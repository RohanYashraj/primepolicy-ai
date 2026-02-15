export function Hero() {
  return (
    <div className="flex flex-col gap-12 items-center py-20 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-0 w-full h-full bg-noise pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center text-center gap-6 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono tracking-widest uppercase mb-4">
          <span className="w-2 h-2 bg-primary animate-pulse" />
          Intelligence Layer Active
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-mono font-bold tracking-tighter text-shadow-industrial leading-none">
          PRIME<span className="text-primary underline decoration-4 underline-offset-8">POLICY</span>-AI
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl font-sans tracking-tight leading-relaxed">
          Engineered for high-fidelity conversion of <span className="text-foreground font-semibold italic">insurance policy specifications</span> into production-ready configuration artifacts.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <div className="flex flex-col items-start gap-1 p-4 border border-border bg-card/50 backdrop-blur-sm min-w-[160px]">
            <span className="text-[10px] font-mono text-primary uppercase">Model</span>
            <span className="text-sm font-semibold">Policy-RAG v2.4</span>
          </div>
          <div className="flex flex-col items-start gap-1 p-4 border border-border bg-card/50 backdrop-blur-sm min-w-[160px]">
            <span className="text-[10px] font-mono text-primary uppercase">Output</span>
            <span className="text-sm font-semibold">Structured JSON</span>
          </div>
          <div className="flex flex-col items-start gap-1 p-4 border border-border bg-card/50 backdrop-blur-sm min-w-[160px]">
            <span className="text-[10px] font-mono text-primary uppercase">Speed</span>
            <span className="text-sm font-semibold">&lt; 1500ms / Page</span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-12" />
    </div>
  );
}
