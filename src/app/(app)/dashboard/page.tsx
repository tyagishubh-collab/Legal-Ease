import { contract } from '@/lib/data';
import { analyzeClauseRisk } from '@/ai/flows/analyze-clause-risk';
import { SafetyScore } from '@/components/dashboard/safety-score';
import { RiskDistributionChart } from '@/components/dashboard/risk-distribution-chart';
import { StatCards } from '@/components/dashboard/stat-cards';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function DashboardData() {
  const riskAnalyses = await Promise.all(
    contract.clauses.map((clause) =>
      analyzeClauseRisk({ clause: clause.text })
    )
  );

  const totalClauses = contract.clauses.length;
  const totalRiskScore = riskAnalyses.reduce(
    (sum, analysis) => sum + analysis.riskScore,
    0
  );
  const averageRiskScore = totalRiskScore / totalClauses;
  const safetyScore = 100 - averageRiskScore;

  const riskCounts = riskAnalyses.reduce(
    (acc, analysis) => {
      acc[analysis.riskLevel]++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const riskData = [
    { name: 'Low Risk', value: riskCounts.low, fill: 'var(--color-chart-5)' },
    { name: 'Medium Risk', value: riskCounts.medium, fill: 'var(--color-chart-4)' },
    { name: 'High Risk', value: riskCounts.high, fill: 'var(--color-chart-3)' },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      <div className="lg:col-span-2">
        <SafetyScore value={safetyScore} />
      </div>
      <div className="lg:col-span-2">
        <RiskDistributionChart data={riskData} />
      </div>
      <div className="lg:col-span-4">
        <StatCards riskCounts={riskCounts} totalClauses={totalClauses} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Contract Dashboard
      </h1>
      <p className="mt-1 text-muted-foreground">
        An overview of your document&apos;s risk profile.
      </p>

      <div className="mt-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardData />
        </Suspense>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      <Skeleton className="h-64 lg:col-span-2" />
      <Skeleton className="h-64 lg:col-span-2" />
      <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}
