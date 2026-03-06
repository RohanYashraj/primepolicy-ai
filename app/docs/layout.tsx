import { getDocsList } from "@/lib/docs";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth-button";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docsList = getDocsList();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Docs Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card/10 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border shadow-[0_1px_0_0_rgba(255,255,255,0.02)] relative z-10 font-mono">
          <Link
            href="/"
            className="font-bold text-sm tracking-tighter flex items-center gap-2 group text-primary hover:opacity-80 transition-opacity"
          >
            <span>&larr; HOME</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-4 scrollbar-industrial">
          <div className="mb-4 text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest pl-2">
            Documentation
          </div>
          <nav className="flex flex-col gap-1">
            {docsList.map((doc) => (
              <Link
                key={doc.slug}
                href={doc.isIndex ? "/docs" : `/docs/${doc.slug}`}
                className="text-sm px-2 py-1.5 rounded-md hover:bg-primary/10 hover:text-primary transition-colors truncate font-sans"
              >
                {doc.title}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Mobile Navbar / Top Bar */}
        <header className="h-16 border-b border-border bg-background/80 flex items-center justify-between px-6 shrink-0 relative z-10 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="md:hidden font-mono text-sm tracking-tighter text-primary"
            >
              &larr; BACK
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <AuthButton hideDashboardLink />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-industrial p-6 lg:p-12 relative z-0">
          {children}
        </main>
      </div>
    </div>
  );
}
