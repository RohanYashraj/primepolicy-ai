import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { Suspense } from 'react'

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
      {/* Industrial Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      
      <div className="w-full max-w-[400px] relative z-10">
        {/* Identity Protocol Header */}
        <div className="mb-8 flex flex-col gap-2">
          <Link href="/" className="font-mono font-bold text-xl tracking-tighter flex items-center gap-2 group w-fit">
            <span className="bg-primary text-primary-foreground px-2 py-0.5 uppercase tracking-[0.1em]">PrimePolicy</span>
          </Link>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-4">
            <span className="text-link font-bold">// ENROLLMENT PROTOCOL</span>
            <span className="opacity-30">SYSTEM_ACCESS_INIT_0.1</span>
          </div>
        </div>

        <Suspense fallback={<div className="w-full h-[400px] border border-border bg-card/20 animate-pulse" />}>
          <SignUp 
            appearance={{
              variables: {
                colorPrimary: 'hsl(221 83% 53%)',
                borderRadius: '0px',
                fontFamily: 'var(--font-geist-sans)',
              },
              elements: {
                card: 'rounded-none border-border bg-card/50 backdrop-blur-sm shadow-none border',
                headerTitle: 'font-mono uppercase tracking-widest text-xl font-bold',
                headerSubtitle: 'text-[10px] font-mono uppercase tracking-wider text-muted-foreground',
                socialButtonsBlockButton: 'rounded-none border-border font-mono text-[10px] uppercase tracking-widest hover:bg-primary/5',
                formButtonPrimary: 'rounded-none bg-primary hover:bg-primary/90 font-mono text-[10px] uppercase tracking-[0.2em] py-3 shadow-none',
                formFieldInput: 'rounded-none border-border bg-background focus:ring-primary focus:border-primary font-mono text-sm',
                footerActionLink: 'text-primary hover:text-primary/80 font-mono text-[10px] uppercase tracking-wider font-bold',
                dividerRow: 'font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50',
              }
            }}
          />
        </Suspense>

        {/* System Status Footer */}
        <div className="mt-8 flex justify-between items-center font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40">
          <div>Status: Uplink_Active</div>
          <div>Connection: Encrypted</div>
        </div>
      </div>
    </main>
  )
}
