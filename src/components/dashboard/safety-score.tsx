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
import { CheckCircle } from 'lucide-react';

type SafetyScoreProps = {
  value: number;
  precautions: string[];
};

const precautionColors = [
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'text-red-500',
];

export function SafetyScore({ value, precautions }: SafetyScoreProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate the progress bar on value change
    const timer = setTimeout(() => setProgress(value), 300);
    return () => clearTimeout(timer);
  }, [value]);

  const getStatus = (score: number) => {
    if (score < 25) {
      return {
        textColor: 'text-red-500',
      };
    }
    if (score < 70) {
      return {
        textColor: 'text-yellow-500',
      };
    }
    return {
      textColor: 'text-green-500',
    };
  };
  
  const status = getStatus(value);

  return (
    <Card className="h-full">
        <CardHeader>
            <CardTitle>Safety Overview</CardTitle>
            <CardDescription>Your document's AI-generated safety rating and key precautions.</CardDescription>
        </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6 items-center p-6">
        <div className="relative h-24 w-24">
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
              <span className={cn('text-3xl font-bold', status.textColor)}>
              {Math.round(value)}
              </span>
          </div>
        </div>

        <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Key Precautions:</h4>
            <ul className="space-y-2">
                {precautions.map((precaution, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <CheckCircle className={cn("h-4 w-4 mt-1 flex-shrink-0", precautionColors[index % precautionColors.length])} />
                        <span className="text-sm text-muted-foreground">{precaution}</span>
                    </li>
                ))}
            </ul>
        </div>
        
      </CardContent>
    </Card>
  );
}
