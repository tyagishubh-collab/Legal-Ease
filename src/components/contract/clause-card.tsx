import type { Clause, RiskAnalysis } from '@/lib/types';
import { ClauseCardClient } from './clause-card-client';
import { Skeleton } from '../ui/skeleton';
import { Suspense } from 'react';
import { AccordionItem } from '../ui/accordion';
import { cn } from '@/lib/utils';


type ClauseCardProps = {
  clause: Clause;
  initialRiskAnalysis: RiskAnalysis;
};

const riskColorMap = {
  high: 'border-red-500/50 bg-red-500/5',
  medium: 'border-amber-500/50 bg-amber-500/5',
  low: 'border-green-500/50 bg-green-500/5',
};

export function ClauseCard({ clause, initialRiskAnalysis }: ClauseCardProps) {
  return (
    <AccordionItem value={clause.id} className={cn('border-b-0 overflow-hidden rounded-lg transition-all', riskColorMap[initialRiskAnalysis.riskLevel])}>
      <Suspense fallback={<Skeleton className="h-48 w-full" />}>
        <ClauseCardClient clause={clause} initialRiskAnalysis={initialRiskAnalysis} />
      </Suspense>
    </AccordionItem>
  );
}
