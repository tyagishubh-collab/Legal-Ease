'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClauseDrilldownModal } from './clause-drilldown-modal';
import type { Clause, RiskAnalysis } from '@/lib/types';

interface ClauseDrilldownProps {
  clauses: (Clause & { risk?: RiskAnalysis })[];
  isOpen: boolean;
  onClose: () => void;
  onClauseUpdate: (clauseId: string, newText: string, newRisk: RiskAnalysis) => void;
  riskLevel: 'high' | 'medium' | 'low';
}

export function ClauseDrilldown({
  clauses,
  isOpen,
  onClose,
  riskLevel,
  onClauseUpdate,
}: ClauseDrilldownProps) {
  if (!isOpen) return null;

  const riskTitleMap = {
    high: 'High Risk Clauses',
    medium: 'Medium Risk Clauses',
    low: 'Low Risk Clauses',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>{riskTitleMap[riskLevel]}</DialogTitle>
        </DialogHeader>
        <ClauseDrilldownModal clauses={clauses} onClauseUpdate={onClauseUpdate} />
      </DialogContent>
    </Dialog>
  );
}
