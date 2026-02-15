import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
      {user.email}
      <LogoutButton />
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button asChild size="sm" variant="ghost" className="rounded-none font-mono text-[10px] uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild size="sm" variant="default" className="rounded-none font-mono text-[10px] uppercase tracking-[0.2em] px-4">
        <Link href="/auth/sign-up">Sign Up</Link>
      </Button>
    </div>
  );
}
