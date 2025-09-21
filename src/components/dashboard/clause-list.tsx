import type { Clause, RiskAnalysis } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ClauseListProps {
  clauses: (Omit<Clause, 'id' | 'entities'> & { risk?: RiskAnalysis })[];
  riskLevel: 'high' | 'medium' | 'low';
  title: string;
}

const riskStyles = {
  high: {
    borderColor: 'border-red-500/30',
    icon: <XCircle className="h-6 w-6 text-red-500" />,
  },
  medium: {
    borderColor: 'border-amber-500/30',
    icon: <AlertCircle className="h-6 w-6 text-amber-500" />,
  },
  low: {
    borderColor: 'border-green-500/30',
    icon: <CheckCircle className="h-6 w-6 text-green-500" />,
  },
};

export function ClauseList({ clauses, riskLevel }: ClauseListProps) {
  const styles = riskStyles[riskLevel];

  return (
    <Card className={cn('overflow-hidden', styles.borderColor)}>
      <CardContent className="p-0">
        {clauses.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {clauses.map((clause, index) => (
              <AccordionItem key={`${riskLevel}-${index}`} value={`item-${index}`} className={cn(index === 0 && "border-t", index === clauses.length-1 && "border-b-0")}>
                <AccordionTrigger className="px-6 text-left hover:no-underline">
                  <span className='font-semibold'>{clause.title}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6">
                  <p className="text-muted-foreground text-sm">{clause.text}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="p-6 text-muted-foreground">No {riskLevel} risk clauses found.</p>
        )}
      </CardContent>
    </Card>
  );
}
