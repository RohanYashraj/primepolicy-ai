import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  Clock, 
  FileText, 
  Zap,
  Activity,
  Box,
  ScanText
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active extractions", value: "12", icon: Activity, detail: "+2 since last shift" },
          { label: "Artefacts generated", value: "842", icon: Box, detail: "Total // V4.2" },
          { label: "Avg processing time", value: "1.4s", icon: Zap, detail: "Optimal latency" },
          { label: "System uptime", value: "99.9%", icon: Clock, detail: "Last 24h" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 border-border/50 bg-card/20 rounded-none relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="absolute top-0 right-0 p-1 text-[8px] font-mono text-muted-foreground/30 uppercase">
              Idx // 0{i+1}
            </div>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-mono font-bold">{stat.value}</span>
              <span className="text-[8px] font-mono text-muted-foreground uppercase">
                {stat.detail}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 border-border/50 bg-card/10 rounded-none relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-mono font-bold text-sm uppercase tracking-[0.2em] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Recent Product Intake
            </h3>
            <Badge variant="outline" className="rounded-none font-mono text-[9px] uppercase tracking-widest">
              Live Feed
            </Badge>
          </div>
          
          <div className="space-y-4">
            {[
              { name: "Commercial_Auto_Policy_Draft_v2.pdf", status: "Analyzed", time: "2m ago", size: "4.2MB" },
              { name: "Workers_Comp_Special_Endorsement.docx", status: "Processing", time: "5m ago", size: "1.1MB" },
              { name: "General_Liability_Umbrella_Spec.pdf", status: "Queue", time: "12m ago", size: "8.7MB" },
            ].map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-border/30 bg-background/50 group hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted flex items-center justify-center font-mono text-[10px] text-muted-foreground">
                    PDF
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold truncate max-w-[200px] md:max-w-xs">{file.name}</p>
                    <p className="text-[9px] font-mono text-muted-foreground uppercase">{file.size} // {file.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={cn(
                    "rounded-none font-mono text-[8px] uppercase tracking-widest px-1.5",
                    file.status === "Analyzed" ? "bg-primary/20 text-primary hover:bg-primary/20" : "bg-muted text-muted-foreground"
                  )}>
                    {file.status}
                  </Badge>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors cursor-pointer" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <button className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary hover:underline">
              View All Intake History // Archive
            </button>
          </div>
        </Card>

        <Card className="p-6 border-border/50 bg-card/10 rounded-none">
          <h3 className="font-mono font-bold text-sm uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <ScanText className="w-4 h-4" />
            System Logic
          </h3>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span>Schema Mapping Accuracy</span>
                <span className="text-primary">99.8%</span>
              </div>
              <div className="h-1 w-full bg-muted overflow-hidden">
                <div className="h-full bg-primary w-[99.8%]" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                <span>RAG Processing Load</span>
                <span>42%</span>
              </div>
              <div className="h-1 w-full bg-muted overflow-hidden">
                <div className="h-full bg-primary w-[42%]" />
              </div>
            </div>

            <div className="p-4 border border-primary/20 bg-primary/5 space-y-3">
              <p className="font-mono text-[9px] uppercase leading-relaxed text-muted-foreground">
                <span className="text-primary font-bold">Protocol Alert:</span> AI engine has identified 4 new pattern variations in recent General Liability specs. Recommend schema update.
              </p>
              <button className="w-full py-2 bg-primary text-primary-foreground font-mono text-[9px] uppercase font-bold tracking-[0.2em]">
                Initialize Optimization
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

