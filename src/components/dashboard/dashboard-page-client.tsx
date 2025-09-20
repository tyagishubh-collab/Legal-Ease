'use client';
import { useState } from 'react';
import type { Contract, Clause, RiskAnalysis } from '@/lib/types';
import { SafetyScore } from '@/components/dashboard/safety-score';
import { RiskDistributionChart } from '@/components/dashboard/risk-distribution-chart';
import { StatCards } from '@/components/dashboard/stat-cards';
import { ClauseDrilldown } from '@/components/dashboard/clause-drilldown';
import { TopLawyers } from './top-lawyers';

type DashboardPageClientProps = {
  initialContract: Contract & {
    riskAnalyses: (RiskAnalysis & { clauseId: string })[];
  };
};

export function DashboardPageClient({
  initialContract,
}: DashboardPageClientProps) {
  const [contract, setContract] = useState(initialContract);

  const [drilldownState, setDrilldownState] = useState<{
    isOpen: boolean;
    riskLevel: 'high' | 'medium' | 'low' | null;
  }>({ isOpen: false, riskLevel: null });

  const clausesWithRisk = contract.clauses.map((clause) => {
    const risk = contract.riskAnalyses.find((r) => r.clauseId === clause.id);
    return { ...clause, risk: risk! };
  });

  const totalClauses = clausesWithRisk.length;
  const totalRiskScore = clausesWithRisk.reduce(
    (sum, c) => sum + (c.risk?.riskScore || 0),
    0
  );
  const averageRiskScore =
    totalClauses > 0 ? totalRiskScore / totalClauses : 0;
  const safetyScore = 100 - averageRiskScore;

  const riskCounts = clausesWithRisk.reduce(
    (acc, c) => {
      if (c.risk) {
        acc[c.risk.riskLevel]++;
      }
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

  const handleStatCardClick = (riskLevel: 'high' | 'medium' | 'low') => {
    setDrilldownState({ isOpen: true, riskLevel });
  };

  const handleClauseUpdate = (
    clauseId: string,
    newText: string,
    newRisk: RiskAnalysis
  ) => {
    setContract((prevContract) => {
      const newClauses = prevContract.clauses.map((c) =>
        c.id === clauseId ? { ...c, text: newText } : c
      );
      const newRiskAnalyses = prevContract.riskAnalyses.map((r) =>
        r.clauseId === clauseId ? { ...r, ...newRisk } : r
      );
      return { ...prevContract, clauses: newClauses, riskAnalyses: newRiskAnalyses };
    });
  };

  const drilldownClauses =
    drilldownState.riskLevel
      ? clausesWithRisk.filter(
          (c) => c.risk.riskLevel === drilldownState.riskLevel
        )
      : [];

  return (
    <div className='space-y-4'>
      <div>
        <SafetyScore value={safetyScore} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
        <RiskDistributionChart data={riskData} />
        <StatCards
          riskCounts={riskCounts}
          totalClauses={totalClauses}
          onCardClick={handleStatCardClick}
        />
      </div>
      <div className="pt-4">
        <TopLawyers />
      </div>
      {drilldownState.isOpen && drilldownState.riskLevel && (
        <ClauseDrilldown
          isOpen={drilldownState.isOpen}
          onClose={() => setDrilldownState({ isOpen: false, riskLevel: null })}
          riskLevel={drilldownState.riskLevel}
          clauses={drilldownClauses}
          onClauseUpdate={handleClauseUpdate}
        />
      )}
    </div>
  );
}
