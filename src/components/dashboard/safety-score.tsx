'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

type SafetyScoreProps = {
  value: number;
};

export function SafetyScore({ value }: SafetyScoreProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate the progress bar on value change
    const timer = setTimeout(() => setProgress(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const getStatus = (score: number) => {
    if (score < 25) {
      return {
        label: 'Overall Safety Score',
        badgeVariant: 'destructive',
        textColor: 'text-red-500',
        badgeClass: 'bg-red-500/20 text-red-700 dark:bg-red-500/30 dark:text-red-300'
      };
    }
    if (score < 70) {
      return {
        label: 'Overall Safety Score',
        badgeVariant: 'secondary',
        textColor: 'text-yellow-500',
        badgeClass: 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-300'
      };
    }
    return {
      label: 'Overall Safety Score',
      badgeVariant: 'default',
      textColor: 'text-green-500',
      badgeClass: 'bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300'
    };
  };
  
  const status = getStatus(value);

  return (
    <Card className="h-full border-none shadow-none">
      <CardContent className="flex flex-col items-center justify-center space-y-4 pt-6">
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

        <Badge variant={'outline'} className={cn('text-sm', status.badgeClass)}>
          {status.label}
        </Badge>
      </CardContent>
    </Card>
  );
}
