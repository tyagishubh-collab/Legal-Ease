import { Suspense } from 'react';
import { contract as initialContract } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardPageClient } from '@/components/dashboard/dashboard-page-client';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';

export default async function DashboardPage() {
  // We can pass initial data to the client component
  const clausesWithRisk = initialContract.clauses.map((clause) => {
    const risk = initialContract.riskAnalyses.find((r) => r.clauseId === clause.id);
    return { ...clause, risk: risk! };
  });

  return (
    <div className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-background overflow-x-hidden">
      <DashboardPageHeader clauses={clausesWithRisk} />
      <p className="mt-1 text-muted-foreground">
        An overview of your document&apos;s risk profile.
      </p>
      <div className="mt-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardPageClient initialContract={initialContract} />
        </Suspense>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full sm:w-96" />
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Skeleton className="h-100" />
          <Skeleton className="h-100" />
          <Skeleton className="h-100" />
        </div>
      </div>
    </div>
  );
}
