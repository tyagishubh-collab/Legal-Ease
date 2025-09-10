import { contract } from '@/lib/data';
import { SafetyScore } from '@/components/dashboard/safety-score';
import { RiskDistributionChart } from '@/components/dashboard/risk-distribution-chart';
import { StatCards } from '@/components/dashboard/stat-cards';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ClauseCard } from '@/components/contract/clause-card';
import type { RiskAnalysis } from '@/lib/types';
import { Tabs, TabsContent, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { FileText, Shield } from 'lucide-react';

async function DashboardData() {
  const riskAnalyses: (RiskAnalysis & { clauseId: string })[] =
    contract.riskAnalyses;

  const totalClauses = contract.clauses.length;
  const totalRiskScore = riskAnalyses.reduce(
    (sum, analysis) => sum + analysis.riskScore,
    0
  );
  const averageRiskScore =
    totalClauses > 0 ? totalRiskScore / totalClauses : 0;
  const safetyScore = 100 - averageRiskScore;

  const riskCounts = riskAnalyses.reduce(
    (acc, analysis) => {
      acc[analysis.riskLevel]++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  const riskData = [
    { name: 'Low Risk', value: riskCounts.low, fill: 'hsl(var(--chart-5))' },
    {
      name: 'Medium Risk',
      value: riskCounts.medium,
      fill: 'hsl(var(--chart-4))',
    },
    { name: 'High Risk', value: riskCounts.high, fill: 'hsl(var(--chart-3))' },
  ];

  const clausesWithRisk = contract.clauses.map((clause) => {
    const risk = riskAnalyses.find((r) => r.clauseId === clause.id);
    return { ...clause, risk };
  });

  return (
    <Tabs defaultValue="overview">
      <TabsList className="mb-6 grid h-auto w-full max-w-md grid-cols-1 sm:grid-cols-2">
        <TabsTrigger value="overview" className="h-10 gap-2">
          <Shield /> Overview
        </TabsTrigger>
        <TabsTrigger value="clauses" className="h-10 gap-2">
          <FileText /> Clause Analysis
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <div className="space-y-4 lg:space-y-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SafetyScore value={safetyScore} />
              <RiskDistributionChart data={riskData} />
            </div>
            <StatCards riskCounts={riskCounts} totalClauses={totalClauses} />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="clauses">
        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight">
            Clause Analysis
          </h2>
          <p className="mt-1 text-muted-foreground">
            A detailed breakdown of each clause's risk.
          </p>
          <div className="mt-6 space-y-4">
            {clausesWithRisk.map((clause) => (
              <ClauseCard
                key={clause.id}
                clause={clause}
                initialRiskAnalysis={clause.risk!}
              />
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
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
    <div className="space-y-6">
       <Skeleton className="h-12 w-full sm:w-96" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64 lg:col-span-2" />
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      </div>
    </div>
  );
}
