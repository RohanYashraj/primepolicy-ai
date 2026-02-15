import { Sidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/dashboard/navbar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth-button";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function ProtectedContent({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return redirect("/auth/login");
  }

  return <>{children}</>;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar>
          <ThemeSwitcher />
          <div className="h-4 w-px bg-border" />
          <Suspense fallback={<div className="w-24 h-8 bg-muted animate-pulse" />}>
            <AuthButton hideDashboardLink />
          </Suspense>
        </Navbar>
        <main className="flex-1 overflow-y-auto p-6 scrollbar-industrial">
          <div className="max-w-7xl mx-auto w-full">
            <Suspense fallback={<div className="w-full h-32 bg-muted/20 animate-pulse rounded-none" />}>
              <ProtectedContent>{children}</ProtectedContent>
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
