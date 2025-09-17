'use client';

import type { Clause, RiskAnalysis } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClauseCardClient } from './clause-card-client';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface ClauseModalProps {
  clause: Clause & { risk: RiskAnalysis };
  isOpen: boolean;
  onClose: () => void;
}

const riskColorMap = {
  high: 'bg-red-500/80 border-red-500/90',
  medium: 'bg-amber-500/80 border-amber-500/90',
  low: 'bg-green-500/80 border-green-500/90',
};

export function ClauseModal({ clause, isOpen, onClose }: ClauseModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-4 text-center items-center relative">
          <DialogTitle className="text-2xl font-headline tracking-tight">{clause.title}</DialogTitle>
          <Badge
            className={cn(
                "absolute top-4 right-4 rounded-full px-3 py-1 text-xs font-semibold text-white",
                riskColorMap[clause.risk.riskLevel]
            )}
          >
            Risk: {clause.risk.riskScore}
          </Badge>
        </DialogHeader>
        
        <ClauseCardClient clause={clause} />
        
        <DialogFooter className="p-6 pt-4 bg-background/80 rounded-b-2xl">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button className='bg-primary/90 hover:bg-primary text-primary-foreground'>Mark as Reviewed</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
