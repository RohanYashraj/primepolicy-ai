export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-mono font-bold uppercase tracking-widest">Specification Analysis</h1>
      <p className="text-sm text-muted-foreground font-mono uppercase">Review and refine AI-extracted product attributes and clauses.</p>
      <div className="p-12 border border-border bg-card/5 transition-colors">
        <p className="font-mono text-xs uppercase text-muted-foreground italic text-center">No active analysis session found // Load Intake to begin extraction.</p>
      </div>
    </div>
  );
}
