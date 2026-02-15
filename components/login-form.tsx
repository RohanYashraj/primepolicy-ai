"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
      router.refresh();
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
        <h1 className="text-2xl font-mono font-bold uppercase tracking-widest text-shadow-industrial">Login</h1>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-tight">Enter your credentials to continue</p>
      </div>

      <div className="border border-border bg-card/50 backdrop-blur-sm p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-muted-foreground/30 uppercase tracking-[0.2em]">Secure // V4</div>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
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
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-mono text-[10px] uppercase tracking-widest text-primary">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-[10px] font-mono uppercase text-muted-foreground hover:text-primary transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              className="rounded-none border-border bg-background/50 font-sans focus-visible:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-mono uppercase tracking-tight">
              Error // {error}
            </div>
          )}

          <Button type="submit" className="rounded-none h-12 font-mono font-bold uppercase tracking-[0.2em] group relative overflow-hidden" disabled={isLoading}>
            <span className="relative z-10">{isLoading ? "Signing in..." : "Sign In"}</span>
            <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-primary hover:underline font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      
      <div className="flex justify-center gap-4 opacity-50">
        <div className="w-1 h-1 bg-border" />
        <div className="w-1 h-1 bg-primary" />
        <div className="w-1 h-1 bg-border" />
      </div>
    </div>
  );
}
