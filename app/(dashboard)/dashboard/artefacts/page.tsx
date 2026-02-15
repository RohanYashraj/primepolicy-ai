export default function ArtefactsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-mono font-bold uppercase tracking-widest">Structured Artefacts</h1>
      <p className="text-sm text-muted-foreground font-mono uppercase">Export PAS-ready configuration data and generated codebases.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50">
        <div className="p-8 border border-border bg-card/5">
          <div className="h-4 w-24 bg-muted mb-4" />
          <div className="h-24 w-full bg-muted/50" />
        </div>
        <div className="p-8 border border-border bg-card/5">
          <div className="h-4 w-24 bg-muted mb-4" />
          <div className="h-24 w-full bg-muted/50" />
        </div>
      </div>
    </div>
  );
}
