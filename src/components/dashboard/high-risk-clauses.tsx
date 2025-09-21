'use client';
import type { Clause } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { XCircle } from 'lucide-react';

interface HighRiskClausesProps {
  clauses: Omit<Clause, 'id' | 'entities'>[];
}

export function HighRiskClauses({ clauses }: HighRiskClausesProps) {
  const safeClauses = Array.isArray(clauses) ? clauses : [];

  return (
    <Card className="border-red-500/30">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 bg-muted/30">
        <XCircle className="h-6 w-6 text-red-500" />
        <div>
          <CardTitle>High Risk</CardTitle>
          <CardDescription>
            {safeClauses.length} {safeClauses.length === 1 ? 'clause' : 'clauses'}{' '}
            identified.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {safeClauses.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {safeClauses.map((clause, index) => (
              <AccordionItem
                key={`high-${index}`}
                value={`item-${index}`}
                className={cn(index === 0 && 'border-t')}
              >
                <AccordionTrigger className="px-6 text-left hover:no-underline">
                  <span className="font-semibold">{clause.title}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  <p className="text-muted-foreground text-sm">
                    {clause.text}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="p-6 text-muted-foreground">
            No high risk clauses found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
