"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut
} from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function AuthButton({ hideDashboardLink = false }: { hideDashboardLink?: boolean }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-20 h-8 bg-muted animate-pulse" />;
  }

  return (
    <>
      <SignedIn>
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {!hideDashboardLink && (
            <>
              <Link href="/dashboard" className="text-primary hover:underline font-bold">Dashboard</Link>
              <div className="h-3 w-px bg-border/50" />
            </>
          )}
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center gap-2">
          <SignInButton mode="modal">
            <Button size="sm" variant="ghost" className="rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
              Login
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="sm" variant="default" className="rounded-none font-mono text-[10px] uppercase tracking-[0.2em] px-4">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </>
  );
}
