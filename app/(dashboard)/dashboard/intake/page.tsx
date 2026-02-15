export default function IntakePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-mono font-bold uppercase tracking-widest">Product Intake</h1>
      <p className="text-sm text-muted-foreground font-mono uppercase">Upload and process insurance product specification documents.</p>
      <div className="border-2 border-dashed border-border p-20 flex flex-col items-center justify-center bg-card/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Drop Specification Document Here // Protocol V4</p>
      </div>
    </div>
  );
}
