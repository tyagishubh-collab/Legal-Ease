'use client';
import { useState, useEffect } from 'react';
import type {
  AnalyzeDocumentRiskOutput,
  AnalyzeDocumentSafetyOutput,
  GetDocumentPrecautionsOutput,
} from '@/lib/types';
import { SafetyScore } from '@/components/dashboard/safety-score';
import { RiskDistributionChart } from '@/components/dashboard/risk-distribution-chart';
import { StatCards } from '@/components/dashboard/stat-cards';
import { ClauseList } from '@/components/dashboard/clause-list';
import { TopLawyers } from './top-lawyers';

type DashboardPageClientProps = {
  initialRiskAnalysis: AnalyzeDocumentRiskOutput;
  initialSafetyAnalysis: AnalyzeDocumentSafetyOutput;
  initialPrecautions: GetDocumentPrecautionsOutput;
};

export function DashboardPageClient({
  initialRiskAnalysis,
  initialSafetyAnalysis,
  initialPrecautions,
}: DashboardPageClientProps) {
  const [riskAnalysis, setRiskAnalysis] = useState(initialRiskAnalysis);
  const [safetyAnalysis, setSafetyAnalysis] = useState(initialSafetyAnalysis);
  const [precautions, setPrecautions] = useState<
    GetDocumentPrecautionsOutput | undefined
  >(initialPrecautions);

  useEffect(() => {
    // On mount, check if there are newer results in localStorage
    const storedResult = localStorage.getItem('latest-analysis-result');
    if (storedResult) {
      try {
        const result = JSON.parse(storedResult);
        console.log('Dashboard loaded data:', result);

        // Safely destructure with default values
        const {
          riskAnalysis: loadedRiskAnalysis,
          safetyAnalysis: loadedSafetyAnalysis,
          precautions: loadedPrecautions,
        } = result ?? {};

        setRiskAnalysis(loadedRiskAnalysis ?? initialRiskAnalysis);
        setSafetyAnalysis(loadedSafetyAnalysis ?? initialSafetyAnalysis);
        setPrecautions(loadedPrecautions ?? initialPrecautions);
      } catch (error) {
        console.error('Failed to parse dashboard data from localStorage', error);
        // Fallback to initial props if parsing fails
        setRiskAnalysis(initialRiskAnalysis);
        setSafetyAnalysis(initialSafetyAnalysis);
        setPrecautions(initialPrecautions);
      }
    }
  }, [initialPrecautions, initialRiskAnalysis, initialSafetyAnalysis]);

  const { highRiskClauses, mediumRiskClauses, lowRiskClauses } =
    riskAnalysis ?? {
      highRiskClauses: [],
      mediumRiskClauses: [],
      lowRiskClauses: [],
    };

  const totalClauses =
    (highRiskClauses?.length ?? 0) +
    (mediumRiskClauses?.length ?? 0) +
    (lowRiskClauses?.length ?? 0);

  const riskCounts = {
    high: highRiskClauses?.length ?? 0,
    medium: mediumRiskClauses?.length ?? 0,
    low: lowRiskClauses?.length ?? 0,
  };

  const riskData = [
    { name: 'Low Risk', value: riskCounts.low, fill: 'hsl(var(--chart-5))' },
    {
      name: 'Medium Risk',
      value: riskCounts.medium,
      fill: 'hsl(var(--chart-4))',
    },
    { name: 'High Risk', value: riskCounts.high, fill: 'hsl(var(--chart-3))' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <SafetyScore
          value={safetyAnalysis.safetyScore}
          precautions={precautions?.precautions || []}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        <RiskDistributionChart data={riskData} />
        <StatCards
          riskCounts={riskCounts}
          totalClauses={totalClauses}
        />
      </div>
      
      <div className="space-y-4 pt-4">
        <ClauseList
          clauses={highRiskClauses}
          riskLevel="high"
          title="High Risk"
        />
        <ClauseList
          clauses={mediumRiskClauses}
          riskLevel="medium"
          title="Medium Risk"
        />
        <ClauseList
          clauses={lowRiskClauses}
          riskLevel="low"
          title="Low Risk"
        />
      </div>

      <div className="pt-4">
        <TopLawyers />
      </div>
    </div>
  );
}
