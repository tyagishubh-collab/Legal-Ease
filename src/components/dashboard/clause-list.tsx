import type { Clause, RiskAnalysis } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ClauseListProps {
  clauses: (Clause & { risk: RiskAnalysis })[];
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

export function ClauseList({ clauses, riskLevel, title }: ClauseListProps) {
  const styles = riskStyles[riskLevel];

  return (
    <Card className={cn('overflow-hidden', styles.borderColor)}>
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 bg-muted/30">
        {styles.icon}
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {clauses.length} {clauses.length === 1 ? 'clause' : 'clauses'} identified.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {clauses.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {clauses.map((clause, index) => (
              <AccordionItem key={clause.id} value={`item-${index}`} className={cn(index === 0 && "border-t")}>
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
