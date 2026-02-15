import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-background selection:bg-primary selection:text-primary-foreground font-sans">
      <div className="flex-1 w-full flex flex-col items-center relative">
        {/* Navigation */}
        <nav className="w-full flex justify-center border-b border-border h-16 sticky top-0 bg-background/80 backdrop-blur-md z-50">
          <div className="w-full max-w-6xl flex justify-between items-center px-6">
            <Link href="/" className="font-mono font-bold text-xl tracking-tighter flex items-center gap-2 group">
              <span className="bg-primary text-primary-foreground px-2 py-0.5 uppercase tracking-[0.1em]">PrimePolicy</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 mr-4">
                <Link href="#features" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary pt-1">Features</Link>
                <Link href="#docs" className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground hover:text-primary pt-1">Docs</Link>
              </div>
              
              <div className="h-4 w-px bg-border/50 hidden md:block" />
              
              <div className="flex items-center gap-2">
                <ThemeSwitcher />
                <Suspense fallback={<div className="w-20 h-8 bg-muted animate-pulse" />}>
                  <AuthButton hideDashboardLink />
                </Suspense>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="w-full max-w-6xl px-6">
          <Suspense fallback={<div className="w-full h-[400px] bg-muted/10 animate-pulse rounded-none" />}>
            <Hero />
          </Suspense>
          
          {/* Main Content Area */}
          <section id="features" className="py-24 grid md:grid-cols-3 gap-8">
            <div className="p-8 border border-border bg-card/30 group hover:border-primary/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-muted-foreground/30 uppercase">01 // Logic</div>
              <h3 className="font-mono font-bold text-xl mb-4 group-hover:text-primary">Deep Extraction</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Our RAG-powered engine identifies nested policy attributes, coverage limits, and exclusion clauses with 99.8% precision.
              </p>
            </div>

            <div className="p-8 border border-border bg-card/30 group hover:border-primary/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-muted-foreground/30 uppercase">02 // Output</div>
              <h3 className="font-mono font-bold text-xl mb-4 group-hover:text-primary">Schema Mapping</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Automatically maps extracted data to Guidewire, Duck Creek, or custom JSON schemas for seamless policy system integration.
              </p>
            </div>

            <div className="p-8 border border-border bg-card/30 group hover:border-primary/50 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-[10px] font-mono text-muted-foreground/30 uppercase">03 // Scale</div>
              <h3 className="font-mono font-bold text-xl mb-4 group-hover:text-primary">Batch Intake</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                Process entire policy libraries in minutes. Transform legacy PDF documents into actionable configuration codebases.
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full border-t border-border mt-20 py-12 flex flex-col items-center gap-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            © 2026 PRIMEPOLICY-AI SYSTEM // ALL RIGHTS RESERVED
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-[10px] font-mono text-muted-foreground hover:text-primary uppercase">Status: Optimal</Link>
            <Link href="#" className="text-[10px] font-mono text-muted-foreground hover:text-primary uppercase">Privacy Protocol</Link>
            <Link href="#" className="text-[10px] font-mono text-muted-foreground hover:text-primary uppercase">API v4.2</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
