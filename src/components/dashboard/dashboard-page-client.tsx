'use client';
import { useState } from 'react';
import type { Contract, Clause, RiskAnalysis } from '@/lib/types';
import { SafetyScore } from '@/components/dashboard/safety-score';
import { RiskDistributionChart } from '@/components/dashboard/risk-distribution-chart';
import { StatCards } from '@/components/dashboard/stat-cards';
import { ClauseDrilldown } from '@/components/dashboard/clause-drilldown';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MapChart } from './map-chart';

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

  const handleExport = () => {
    const doc = new jsPDF();
    
    doc.setFont('Poppins', 'bold');
    doc.setFontSize(22);
    doc.text('LegalEase Report', 14, 22);
    
    doc.setFont('Inter', 'normal');
    doc.setFontSize(12);
    doc.text(`Overall Safety Score: ${safetyScore.toFixed(0)}`, 14, 32);

    doc.autoTable({
      startY: 40,
      head: [['Risk Level', 'Count', 'Percentage']],
      body: [
        ['High Risk', riskCounts.high, `${((riskCounts.high/totalClauses)*100).toFixed(0)}%`],
        ['Medium Risk', riskCounts.medium, `${((riskCounts.medium/totalClauses)*100).toFixed(0)}%`],
        ['Low Risk', riskCounts.low, `${((riskCounts.low/totalClauses)*100).toFixed(0)}%`],
      ],
    });

    const highRiskClauses = clausesWithRisk.filter(c => c.risk.riskLevel === 'high');

    if (highRiskClauses.length > 0) {
      doc.addPage();
      doc.setFont('Poppins', 'bold');
      doc.text('High Risk Clauses', 14, 22);
      doc.setFont('Inter', 'normal');
      let y = 32;
      highRiskClauses.forEach(clause => {
        doc.setFontSize(12);
        doc.setFont('Inter', 'bold');
        doc.text(clause.title, 14, y);
        y += 7;
        doc.setFontSize(10);
        doc.setFont('Inter', 'normal');
        const splitText = doc.splitTextToSize(clause.text, 180);
        doc.text(splitText, 14, y);
        y += (splitText.length * 4) + 10;
        if(y > 280) {
          doc.addPage();
          y = 22;
        }
      });
    }

    doc.save('LegalEase-Report.pdf');
  };

  const drilldownClauses =
    drilldownState.riskLevel
      ? clausesWithRisk.filter(
          (c) => c.risk.riskLevel === drilldownState.riskLevel
        )
      : [];

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export as PDF</Button>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:gap-8">
        <div className="lg:col-span-3">
          <SafetyScore value={safetyScore} />
        </div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
          <RiskDistributionChart data={riskData} />
          <MapChart />
        </div>
        <div className="lg:col-span-3">
          <StatCards
            riskCounts={riskCounts}
            totalClauses={totalClauses}
            onCardClick={handleStatCardClick}
          />
        </div>
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
