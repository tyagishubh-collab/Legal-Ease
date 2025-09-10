import type { Clause } from '@/lib/types';
import { analyzeClauseRisk } from '@/ai/flows/analyze-clause-risk';
import { ClauseCardClient } from './clause-card-client';
import { Skeleton } from '../ui/skeleton';
import { Suspense } from 'react';

type ClauseCardProps = {
  clause: Clause;
};

export async function ClauseCard({ clause }: ClauseCardProps) {
  const riskAnalysis = await analyzeClauseRisk({ clause: clause.text });

  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <ClauseCardClient clause={clause} initialRiskAnalysis={riskAnalysis} />
    </Suspense>
  );
}
