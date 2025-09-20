'use client';

import { Button } from '../ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Clause, RiskAnalysis } from '@/lib/types';

interface DashboardPageHeaderProps {
  clauses: (Clause & { risk: RiskAnalysis })[];
}

export function DashboardPageHeader({ clauses }: DashboardPageHeaderProps) {
  const totalClauses = clauses.length;
  const totalRiskScore = clauses.reduce(
    (sum, c) => sum + (c.risk?.riskScore || 0),
    0
  );
  const averageRiskScore =
    totalClauses > 0 ? totalRiskScore / totalClauses : 0;
  const safetyScore = 100 - averageRiskScore;

  const riskCounts = clauses.reduce(
    (acc, c) => {
      if (c.risk) {
        acc[c.risk.riskLevel]++;
      }
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

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
        [
          'High Risk',
          riskCounts.high,
          `${((riskCounts.high / totalClauses) * 100).toFixed(0)}%`,
        ],
        [
          'Medium Risk',
          riskCounts.medium,
          `${((riskCounts.medium / totalClauses) * 100).toFixed(0)}%`,
        ],
        [
          'Low Risk',
          riskCounts.low,
          `${((riskCounts.low / totalClauses) * 100).toFixed(0)}%`,
        ],
      ],
    });

    const highRiskClauses = clauses.filter(
      (c) => c.risk.riskLevel === 'high'
    );

    if (highRiskClauses.length > 0) {
      doc.addPage();
      doc.setFont('Poppins', 'bold');
      doc.text('High Risk Clauses', 14, 22);
      doc.setFont('Inter', 'normal');
      let y = 32;
      highRiskClauses.forEach((clause) => {
        doc.setFontSize(12);
        doc.setFont('Inter', 'bold');
        doc.text(clause.title, 14, y);
        y += 7;
        doc.setFontSize(10);
        doc.setFont('Inter', 'normal');
        const splitText = doc.splitTextToSize(clause.text, 180);
        doc.text(splitText, 14, y);
        y += splitText.length * 4 + 10;
        if (y > 280) {
          doc.addPage();
          y = 22;
        }
      });
    }

    doc.save('LegalEase-Report.pdf');
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Contract Dashboard
      </h1>
      <Button onClick={handleExport}>
        <Download className="mr-2 h-4 w-4" /> Export as PDF
      </Button>
    </div>
  );
}
