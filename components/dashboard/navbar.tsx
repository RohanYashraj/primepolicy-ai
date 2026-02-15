"use client";

import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  "/dashboard": "System Overview",
  "/dashboard/intake": "Product Intake",
  "/dashboard/analysis": "Specification Analysis",
  "/dashboard/artefacts": "Structured Artefacts",
  "/dashboard/integrations": "PAS Integrations",
  "/dashboard/settings": "System Settings",
};

export function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = routeNames[pathname] || "PrimePolicy AI";

  return (
    <nav className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-4 w-1 bg-primary" />
        <h2 className="font-mono font-bold text-sm uppercase tracking-[0.2em] pt-0.5">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {children}
      </div>
    </nav>
  );
}
