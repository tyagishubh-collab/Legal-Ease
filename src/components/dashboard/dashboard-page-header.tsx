'use client';

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
    doc.text('ClauseWise Report', 14, 22);

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

    doc.save('ClauseWise-Report.pdf');
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="font-headline text-3xl font-bold tracking-tight">
        Contract Dashboard
      </h1>
      <button className="botao" onClick={handleExport}>
        <svg
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mysvg"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <g id="Interface / Download">
              <path
                id="Vector"
                d="M6 21H18M12 3V17M12 17L17 12M12 17L7 12"
                stroke="#f1f1f1"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </g>
        </svg>
        <span className="texto">Download</span>
      </button>
    </div>
  );
}
