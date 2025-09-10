import { Suspense } from 'react';
import { contract as initialContract } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardPageClient } from '@/components/dashboard/dashboard-page-client';

export default async function DashboardPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          Contract Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          An overview of your document&apos;s risk profile.
        </p>
        <div className="mt-8">
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardPageClient initialContract={initialContract} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-12 w-full sm:w-96" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="grid gap-4 md:grid-cols-2 lg:col-span-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:col-span-3 lg:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}
