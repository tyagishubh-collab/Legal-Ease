'use client';
import { useState, useEffect } from 'react';
import type { AnalyzeDocumentRiskOutput, AnalyzeDocumentSafetyOutput, Clause, RiskAnalysis } from '@/lib/types';
import { SafetyScore } from '@/components/dashboard/safety-score';
import { RiskDistributionChart } from '@/components/dashboard/risk-distribution-chart';
import { StatCards } from '@/components/dashboard/stat-cards';
import { ClauseDrilldown } from '@/components/dashboard/clause-drilldown';
import { TopLawyers } from './top-lawyers';
import { ClauseList } from './clause-list';

type DashboardPageClientProps = {
  initialRiskAnalysis: AnalyzeDocumentRiskOutput;
  initialSafetyAnalysis: AnalyzeDocumentSafetyOutput;
};

export function DashboardPageClient({
  initialRiskAnalysis,
  initialSafetyAnalysis,
}: DashboardPageClientProps) {
  const [riskAnalysis, setRiskAnalysis] = useState(initialRiskAnalysis);
  const [safetyAnalysis, setSafetyAnalysis] = useState(initialSafetyAnalysis);

  const [drilldownState, setDrilldownState] = useState<{
    isOpen: boolean;
    riskLevel: 'high' | 'medium' | 'low' | null;
  }>({ isOpen: false, riskLevel: null });

  useEffect(() => {
    // On mount, check if there are newer results in localStorage
    const storedRiskResult = localStorage.getItem('latest-analysis-result');
    const storedSafetyResult = localStorage.getItem('latest-safety-result');

    if (storedRiskResult) {
      setRiskAnalysis(JSON.parse(storedRiskResult));
    }
    if (storedSafetyResult) {
        setSafetyAnalysis(JSON.parse(storedSafetyResult));
    }
  }, []);

  const { highRiskClauses, mediumRiskClauses, lowRiskClauses } = riskAnalysis;

  const totalClauses =
    highRiskClauses.length + mediumRiskClauses.length + lowRiskClauses.length;

  const riskCounts = {
    high: highRiskClauses.length,
    medium: mediumRiskClauses.length,
    low: lowRiskClauses.length,
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

  const handleStatCardClick = (riskLevel: 'high' | 'medium' | 'low') => {
    setDrilldownState({ isOpen: true, riskLevel });
  };
  
  // This function is no longer needed as we are not updating clauses on the dashboard
  // Leaving it here in case future functionality requires it.
  const handleClauseUpdate = (
    clauseId: string,
    newText: string,
    newRisk: RiskAnalysis
  ) => {
    // This would require a more complex state structure if we were to allow
    // editing and re-analyzing from the dashboard. For now, analysis is one-way.
  };

  const getDrilldownClauses = () => {
    if (!drilldownState.riskLevel) return [];
    switch (drilldownState.riskLevel) {
        case 'high': return highRiskClauses;
        case 'medium': return mediumRiskClauses;
        case 'low': return lowRiskClauses;
        default: return [];
    }
  }

  return (
    <div className='space-y-8'>
      <div>
        <SafetyScore value={safetyAnalysis.safetyScore} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        <RiskDistributionChart data={riskData} />
        <StatCards
          riskCounts={riskCounts}
          totalClauses={totalClauses}
          onCardClick={handleStatCardClick}
        />
      </div>

      <div className="space-y-8 pt-4">
        <ClauseList clauses={mediumRiskClauses as (Clause & { risk: RiskAnalysis; })[]} riskLevel="medium" title="Medium Risk Clauses" />
        <ClauseList clauses={lowRiskClauses as (Clause & { risk: RiskAnalysis; })[]} riskLevel="low" title="Low Risk Clauses" />
      </div>

      <div className="pt-4">
        <TopLawyers />
      </div>
      {drilldownState.isOpen && drilldownState.riskLevel && (
        <ClauseDrilldown
          isOpen={drilldownState.isOpen}
          onClose={() => setDrilldownState({ isOpen: false, riskLevel: null })}
          riskLevel={drilldownState.riskLevel}
          clauses={getDrilldownClauses() as (Clause & { risk: RiskAnalysis; })[]}
          onClauseUpdate={handleClauseUpdate}
        />
      )}
    </div>
  );
}
