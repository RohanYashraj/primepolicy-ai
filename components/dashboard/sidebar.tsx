"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileUp,
  ScanText,
  Database,
  Puzzle,
  Settings,
  Menu,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Product Intake", href: "/dashboard/intake", icon: FileUp },
  { name: "Structured Artefacts", href: "/dashboard/artefacts", icon: Database },
  { name: "Integrations", href: "/dashboard/integrations", icon: Puzzle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col border-r border-border bg-card/30 backdrop-blur-sm transition-all duration-300 relative",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo Area */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <Link href="/" className="font-mono font-bold text-xl tracking-tighter flex items-center gap-2 group overflow-hidden">
          {isCollapsed ? (
            <span className="bg-primary text-primary-foreground px-2 py-0.5 uppercase tracking-[0.1em]">P</span>
          ) : (
            <span className="bg-primary text-primary-foreground px-2 py-0.5 uppercase tracking-[0.1em] whitespace-nowrap">PrimePolicy</span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-none transition-colors group relative",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
              {!isCollapsed && (
                <span className="font-mono text-[10px] uppercase tracking-widest pt-0.5">
                  {item.name}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] font-mono uppercase tracking-widest hidden group-hover:block border border-border z-50 whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-20 bg-background border border-border rounded-full w-8 h-8 z-10 hover:bg-muted hidden md:flex"
      >
        {isCollapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      {/* Bottom Industrial Status */}
      <div className="p-4 border-t border-border">
        {!isCollapsed && (
          <div className="font-mono text-[8px] uppercase text-muted-foreground/50 tracking-[0.2em]">
            System Status: Optimal // Core v4.2
          </div>
        )}
      </div>
    </div>
  );
}
