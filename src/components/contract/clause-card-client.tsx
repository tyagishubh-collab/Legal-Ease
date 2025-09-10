'use client';

import { useState, useTransition } from 'react';
import type { Clause, RiskAnalysis, Summary, Explanation } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  summarizeClauseAction,
  explainClauseForRoleAction,
} from '@/lib/actions';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle, FileText, Lightbulb, Users } from 'lucide-react';

type ClauseCardClientProps = {
  clause: Clause;
  initialRiskAnalysis: RiskAnalysis;
};

const riskColorMap = {
  high: 'border-red-500/50 bg-red-500/5',
  medium: 'border-amber-500/50 bg-amber-500/5',
  low: 'border-green-500/50 bg-green-500/5',
};

type DetailLevel = 'short' | 'medium' | 'verbose';
type UserRole = 'lawyer' | 'entrepreneur' | 'student';

export function ClauseCardClient({
  clause,
  initialRiskAnalysis,
}: ClauseCardClientProps) {
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('short');
  const [userRole, setUserRole] = useState<UserRole>('entrepreneur');

  const handleSummaryGeneration = (level: DetailLevel) => {
    setDetailLevel(level);
    startTransition(async () => {
      setSummary(null);
      const result = await summarizeClauseAction({
        clauseText: clause.text,
        detailLevel: level,
      });
      setSummary(result);
    });
  };

  const handleExplanationGeneration = (role: UserRole) => {
    setUserRole(role);
    startTransition(async () => {
      setExplanation(null);
      const result = await explainClauseForRoleAction({
        clauseText: clause.text,
        userRole: role,
      });
      setExplanation(result);
    });
  };

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all',
        riskColorMap[initialRiskAnalysis.riskLevel]
      )}
    >
      <CardContent className="p-0">
        <Accordion type="single" collapsible>
          <AccordionItem value={clause.id} className="border-b-0">
            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline">
              <div className="flex items-center gap-4">
                <AlertCircle
                  className={cn('h-5 w-5 flex-shrink-0', {
                    'text-red-500': initialRiskAnalysis.riskLevel === 'high',
                    'text-amber-500': initialRiskAnalysis.riskLevel === 'medium',
                    'text-green-500': initialRiskAnalysis.riskLevel === 'low',
                  })}
                />
                <h3 className="font-headline text-lg font-semibold tracking-tight">
                  {clause.title}
                </h3>
                <Badge variant="outline" className="ml-2 font-mono text-xs">
                  Risk: {initialRiskAnalysis.riskScore}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <p className="mb-6 text-muted-foreground">{clause.text}</p>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="summary"
                    onClick={() =>
                      !summary && handleSummaryGeneration(detailLevel)
                    }
                  >
                    <FileText className="mr-2" /> Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="explanation"
                    onClick={() =>
                      !explanation && handleExplanationGeneration(userRole)
                    }
                  >
                    <Lightbulb className="mr-2" /> Explanation
                  </TabsTrigger>
                  <TabsTrigger value="entities">
                    <Users className="mr-2" /> Entities
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-4">
                  <div className="mb-4">
                    <Select
                      onValueChange={(v: DetailLevel) =>
                        handleSummaryGeneration(v)
                      }
                      defaultValue={detailLevel}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select detail level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="verbose">Verbose</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {isPending && !summary ? (
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-2/5 mt-4" />
                      <Skeleton className="h-4 w-3/5" />
                    </div>
                  ) : (
                    summary && (
                      <div className="space-y-4">
                        <p>{summary.summary}</p>
                        <ul className="list-disc space-y-2 pl-5">
                          {summary.bulletPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </TabsContent>
                <TabsContent value="explanation" className="mt-4">
                  <Tabs
                    defaultValue={userRole}
                    onValueChange={(v) =>
                      handleExplanationGeneration(v as UserRole)
                    }
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="lawyer">Lawyer</TabsTrigger>
                      <TabsTrigger value="entrepreneur">Entrepreneur</TabsTrigger>
                      <TabsTrigger value="student">Student</TabsTrigger>
                    </TabsList>
                    <div className="mt-4 min-h-[100px]">
                      {isPending && !explanation ? (
                        <div className="space-y-3">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      ) : (
                        explanation && <p>{explanation.explanation}</p>
                      )}
                    </div>
                  </Tabs>
                </TabsContent>
                <TabsContent value="entities" className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {clause.entities.length > 0 ? (
                      clause.entities.map((entity, i) => (
                        <Badge key={i} variant="secondary">
                          <strong className="mr-1.5">{entity.type}:</strong>{' '}
                          {entity.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No entities identified in this clause.
                      </p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
