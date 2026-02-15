export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-mono font-bold uppercase tracking-widest">System Settings</h1>
      <p className="text-sm text-muted-foreground font-mono uppercase">Manage extraction protocols, user roles, and security keys.</p>
      <div className="space-y-4 max-w-md">
        <div className="flex justify-between items-center py-4 border-b border-border">
          <span className="font-mono text-[10px] uppercase">RAG Optimization Engine</span>
          <div className="w-12 h-6 bg-primary" />
        </div>
        <div className="flex justify-between items-center py-4 border-b border-border">
          <span className="font-mono text-[10px] uppercase">Batch Intake Protocol</span>
          <div className="w-12 h-6 bg-muted text-muted-foreground text-[8px] flex items-center justify-center">OFF</div>
        </div>
      </div>
    </div>
  );
}
