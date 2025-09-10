'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type SafetyScoreProps = {
  value: number;
};

export function SafetyScore({ value }: SafetyScoreProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const getStatus = (score: number) => {
    if (score >= 75) {
      return {
        label: 'Safe to Sign',
        badgeVariant: 'default',
        progressColor: 'bg-green-500',
        textColor: 'text-green-500',
        icon: <CheckCircle className="mr-2 h-5 w-5" />,
      };
    }
    if (score >= 40) {
      return {
        label: 'Review Carefully',
        badgeVariant: 'secondary',
        progressColor: 'bg-amber-500',
        textColor: 'text-amber-500',
        icon: <AlertTriangle className="mr-2 h-5 w-5" />,
      };
    }
    return {
      label: 'High Risk Contract',
      badgeVariant: 'destructive',
      progressColor: 'bg-red-500',
      textColor: 'text-red-500',
      icon: <XCircle className="mr-2 h-5 w-5" />,
    };
  };

  const status = getStatus(value);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Overall Safety Score</CardTitle>
        <CardDescription>
          Based on our analysis of all clauses.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 pt-2">
        <div className="relative h-32 w-32">
          <svg className="h-full w-full" viewBox="0 0 36 36">
            <path
              className="text-muted/50"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            <path
              className={cn('transition-all duration-1000 ease-out', status.textColor)}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeDasharray={`${progress}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-4xl font-bold', status.textColor)}>
              {Math.round(value)}
            </span>
          </div>
        </div>

        <Badge variant={status.badgeVariant} className="text-sm">
          {status.icon}
          {status.label}
        </Badge>
      </CardContent>
    </Card>
  );
}
