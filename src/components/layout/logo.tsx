import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        'flex items-center gap-2.5 text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md',
        className
      )}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <ShieldCheck className="h-5 w-5" />
      </div>
      <div className="font-headline text-xl font-bold group-data-[collapsible=icon]:hidden">
        ClauseWise
      </div>
    </Link>
  );
}
