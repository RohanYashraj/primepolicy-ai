"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col items-center gap-2 mb-4">
        <Link href="/" className="font-mono font-bold text-2xl tracking-tighter flex items-center gap-2 mb-2">
          <span className="bg-primary text-primary-foreground px-3 py-1 uppercase tracking-[0.1em]">PrimePolicy</span>
        </Link>
        <h1 className="text-2xl font-mono font-bold uppercase tracking-widest text-shadow-industrial text-center">Forgot Password</h1>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-tight">Reset your password to regain access</p>
      </div>

      <div className="border border-border bg-card/50 backdrop-blur-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-muted-foreground/30 uppercase tracking-[0.2em]">Reset // V4</div>
        
        {success ? (
          <div className="flex flex-col gap-6 text-center">
            <div className="p-4 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest leading-relaxed">
              Check your email for reset instructions.
            </div>
            <Link href="/auth/login" className="text-xs font-mono uppercase text-muted-foreground hover:text-primary transition-colors underline underline-offset-4">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-primary">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="rounded-none border-border bg-background/50 font-sans focus-visible:ring-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-mono uppercase tracking-tight">
                Error // {error}
              </div>
            )}

            <Button type="submit" className="rounded-none h-12 font-mono font-bold uppercase tracking-[0.2em] group relative overflow-hidden" disabled={isLoading}>
              <span className="relative z-10">{isLoading ? "Sending..." : "Reset Password"}</span>
              <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
            
            <div className="text-center pt-4 border-t border-border/50">
               <Link href="/auth/login" className="text-[10px] font-mono uppercase text-muted-foreground hover:text-primary transition-colors">
                 Back to Login
               </Link>
            </div>
          </form>
        )}
      </div>
      
      <div className="flex justify-center gap-4 opacity-50">
        <div className="w-1 h-1 bg-border" />
        <div className="w-1 h-1 bg-primary" />
        <div className="w-1 h-1 bg-border" />
      </div>
    </div>
  );
}
