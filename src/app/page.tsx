import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="relative flex flex-col items-center justify-center p-8 text-center">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Welcome to <span className="text-primary">ClauseWise</span>
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Your AI-powered legal assistant. Analyze documents, understand complex clauses, and assess risks with confidence.
        </p>
        <div className="mt-8">
          <Button asChild size="lg" className="font-semibold shadow-lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
