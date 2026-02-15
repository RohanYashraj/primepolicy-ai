import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Link href="/" className="font-mono font-bold text-2xl tracking-tighter flex items-center gap-2 mb-2">
            <span className="bg-primary text-primary-foreground px-3 py-1 uppercase tracking-[0.1em]">PrimePolicy</span>
          </Link>
          <h1 className="text-2xl font-mono font-bold uppercase tracking-widest text-shadow-industrial text-center">Registration Successful</h1>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-tight">Please confirm your email</p>
        </div>

        <div className="border border-border bg-card/50 backdrop-blur-sm p-8 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <div className="absolute top-0 right-0 p-2 text-[8px] font-mono text-muted-foreground/30 uppercase tracking-[0.2em]">Success // V4</div>
          
          <div className="flex flex-col gap-6">
            <div className="p-4 bg-primary/10 border border-primary/20 text-primary text-[10px] font-mono uppercase tracking-widest leading-relaxed">
              Your account has been created. Please check your email for a verification link.
            </div>
            
            <p className="text-sm text-muted-foreground font-sans tracking-tight">
              Once verified, you will have full access to the PRIMEPOLICY-AI platform.
            </p>

            <Link href="/auth/login" className="text-xs font-mono uppercase text-muted-foreground hover:text-primary transition-colors underline underline-offset-4 mt-4">
              Return to Login
            </Link>
          </div>
        </div>

        <div className="flex justify-center gap-4 opacity-50">
          <div className="w-1 h-1 bg-border" />
          <div className="w-1 h-1 bg-primary" />
          <div className="w-1 h-1 bg-border" />
        </div>
      </div>
    </div>
  );
}
