"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={logout}
      className="rounded-none border-border/50 font-mono text-[9px] uppercase tracking-widest hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 h-7 px-2"
    >
      Sign Out
    </Button>
  );
}
