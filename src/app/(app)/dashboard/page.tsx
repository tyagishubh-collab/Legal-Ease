import { Suspense } from 'react';
import { contract as initialContract } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardPageClient } from '@/components/dashboard/dashboard-page-client';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import type { AnalyzeDocumentRiskOutput, AnalyzeDocumentSafetyOutput, Clause, GetDocumentPrecautionsOutput, RiskAnalysis } from '@/lib/types';


export default async function DashboardPage() {
  // We can pass initial data to the client component
  // This will be overridden by client-side state if an analysis has been run
  const clausesWithRisk: (Clause & { risk: RiskAnalysis })[] = initialContract.clauses.map((clause) => {
    const risk = initialContract.riskAnalyses.find((r) => r.clauseId === clause.id);
    return { ...clause, risk: risk! };
  });

  const initialRiskAnalysis: AnalyzeDocumentRiskOutput = {
    highRiskClauses: clausesWithRisk.filter(c => c.risk.riskLevel === 'high'),
    mediumRiskClauses: clausesWithRisk.filter(c => c.risk.riskLevel === 'medium'),
    lowRiskClauses: clausesWithRisk.filter(c => c.risk.riskLevel === 'low'),
  }

  const totalRiskScore = clausesWithRisk.reduce((sum, c) => sum + (c.risk?.riskScore || 0), 0);
  const averageRiskScore = clausesWithRisk.length > 0 ? totalRiskScore / clausesWithRisk.length : 0;
  const safetyScore = 100 - averageRiskScore;
  
  const initialSafetyAnalysis: AnalyzeDocumentSafetyOutput = {
    safetyScore: safetyScore,
    keyRisk: "The indemnification clause is uncapped, posing significant financial risk."
  }
  
  const initialPrecautions: GetDocumentPrecautionsOutput = {
    precautions: [
        "Thoroughly review the uncapped indemnification clause (Clause 6) as it poses significant financial risk.",
        "Clarify the termination conditions, as the current language is perpetual for confidentiality.",
        "Ensure you have a process to label or document all communications intended to be confidential.",
        "Confirm that the Governing Law and jurisdiction in California are acceptable for your business."
    ]
  }

  return (
    <div className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-background overflow-x-hidden">
      <DashboardPageHeader clauses={clausesWithRisk} />
      <p className="mt-1 text-muted-foreground">
        An overview of your document&apos;s risk profile.
      </p>
      <div className="mt-8">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardPageClient 
            initialRiskAnalysis={initialRiskAnalysis}
            initialSafetyAnalysis={initialSafetyAnalysis}
            initialPrecautions={initialPrecautions}
          />
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
