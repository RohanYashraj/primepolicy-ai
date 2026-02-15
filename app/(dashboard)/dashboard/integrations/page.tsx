export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-mono font-bold uppercase tracking-widest">PAS Integrations</h1>
      <p className="text-sm text-muted-foreground font-mono uppercase">Configure endpoint mapping for Guidewire, Duck Creek, and custom SAP/PAS systems.</p>
      <div className="p-8 border border-border bg-card/5 relative overflow-hidden">
         <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
           <span className="font-mono text-[10px] uppercase tracking-widest border border-primary px-3 py-1 text-primary">Module Locked // Requires Admin Protocol</span>
         </div>
         <div className="space-y-4">
           <div className="h-1 lg:w-1/2 bg-primary/20" />
           <div className="h-1 lg:w-1/3 bg-primary/10" />
         </div>
      </div>
    </div>
  );
}
