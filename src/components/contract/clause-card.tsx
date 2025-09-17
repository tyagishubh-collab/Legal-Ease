import type { Clause, RiskAnalysis } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ClauseCardProps = {
  clause: Clause & { risk: RiskAnalysis };
  onClick: () => void;
};

const riskColorMap = {
  high: 'border-red-500/50 bg-red-500/5 hover:bg-red-500/10',
  medium: 'border-amber-500/50 bg-amber-500/5 hover:bg-amber-500/10',
  low: 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10',
};

export function ClauseCard({ clause, onClick }: ClauseCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
        riskColorMap[clause.risk.riskLevel]
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg font-headline tracking-tight">
            {clause.title}
          </CardTitle>
          <Badge variant="outline" className="font-mono text-xs whitespace-nowrap">
            Risk: {clause.risk.riskScore}
          </Badge>
        </div>
        <CardDescription className="pt-2 line-clamp-3 text-xs">
          {clause.text}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
