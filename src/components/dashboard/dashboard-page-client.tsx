'use client';
import { useState, useEffect } from 'react';
import type {
  AnalyzeDocumentRiskOutput,
  AnalyzeDocumentSafetyOutput,
  GetDocumentPrecautionsOutput,
  Clause,
  RiskAnalysis,
} from '@/lib/types';
import { SafetyScore } from '@/components/dashboard/safety-score';
import { RiskDistributionChart } from '@/components/dashboard/risk-distribution-chart';
import { StatCards } from '@/components/dashboard/stat-cards';
import { TopLawyers } from './top-lawyers';
import { ClauseDrilldown } from './clause-drilldown';

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
  
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<'high' | 'medium' | 'low'>('high');


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

  const handleCardClick = (riskLevel: 'high' | 'medium' | 'low') => {
    setSelectedRiskLevel(riskLevel);
    setIsDrilldownOpen(true);
  };
  
  const handleClauseUpdate = (clauseId: string, newText: string, newRisk: RiskAnalysis) => {
    // This function would be more complex in a real app, involving state updates
    // and potentially re-calculating the safety score.
    console.log('Updating clause:', { clauseId, newText, newRisk });
    // For now, we'll just log it
  };


  const {
    highRiskClauses = [],
    mediumRiskClauses = [],
    lowRiskClauses = [],
  } = riskAnalysis ?? {};
  
  const allClauses = [
      ...highRiskClauses,
      ...mediumRiskClauses,
      ...lowRiskClauses
  ];

  const totalClauses = allClauses.length;

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
  
  const clausesForDrilldown = () => {
    switch (selectedRiskLevel) {
        case 'high':
            return highRiskClauses;
        case 'medium':
            return mediumRiskClauses;
        case 'low':
            return lowRiskClauses;
        default:
            return [];
    }
  }

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
          onCardClick={handleCardClick}
        />
      </div>
      
      <div className="pt-4">
        <TopLawyers />
      </div>

       <ClauseDrilldown 
        isOpen={isDrilldownOpen}
        onClose={() => setIsDrilldownOpen(false)}
        clauses={clausesForDrilldown() as (Clause & { risk: RiskAnalysis })[]}
        riskLevel={selectedRiskLevel}
        onClauseUpdate={handleClauseUpdate}
      />
    </div>
  );
}
