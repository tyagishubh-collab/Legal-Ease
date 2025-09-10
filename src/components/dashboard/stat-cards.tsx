'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

type StatCardsProps = {
  riskCounts: { high: number; medium: number; low: number };
  totalClauses: number;
  onCardClick: (riskLevel: 'high' | 'medium' | 'low') => void;
};

export function StatCards({
  riskCounts,
  totalClauses,
  onCardClick,
}: StatCardsProps) {
  const stats = [
    {
      title: 'High Risk Clauses',
      count: riskCounts.high,
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      color: 'text-red-500',
      level: 'high',
    },
    {
      title: 'Medium Risk Clauses',
      count: riskCounts.medium,
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
      color: 'text-amber-500',
      level: 'medium',
    },
    {
      title: 'Low Risk Clauses',
      count: riskCounts.low,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      color: 'text-green-500',
      level: 'low',
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onCardClick(stat.level)}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.count}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalClauses > 0
                ? `${((stat.count / totalClauses) * 100).toFixed(0)}% of total`
                : '0% of total'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
