import type { Clause, RiskAnalysis } from '@/lib/types';
import { ClauseCardClient } from './clause-card-client';
import { Skeleton } from '../ui/skeleton';
import { Suspense } from 'react';

type ClauseCardProps = {
  clause: Clause;
  initialRiskAnalysis: RiskAnalysis;
};

export function ClauseCard({ clause, initialRiskAnalysis }: ClauseCardProps) {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <ClauseCardClient clause={clause} initialRiskAnalysis={initialRiskAnalysis} />
    </Suspense>
  );
}
