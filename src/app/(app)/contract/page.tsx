import { contract } from '@/lib/data';
import { ClauseCard } from '@/components/contract/clause-card';
import { FileText } from 'lucide-react';
import { analyzeClauseRisk } from '@/ai/flows/analyze-clause-risk';
import type { RiskAnalysis } from '@/lib/types';

export default async function ContractPage() {
  const riskAnalyses: (RiskAnalysis & { clauseId: string })[] = [];
  for (const clause of contract.clauses) {
    const analysis = await analyzeClauseRisk({ clause: clause.text });
    riskAnalyses.push({ ...analysis, clauseId: clause.id });
     // Add a small delay to be respectful of API rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }


  const clausesWithRisk = contract.clauses.map(clause => {
    const risk = riskAnalyses.find(r => r.clauseId === clause.id);
    return { ...clause, risk };
  });


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-start gap-4">
        <FileText className="h-8 w-8 text-muted-foreground mt-1" />
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            {contract.title}
          </h1>
          <p className="mt-1 text-muted-foreground">
            A clause-by-clause analysis of your document.
          </p>
        </div>
      </div>
      <div className="mt-8 space-y-4">
        {clausesWithRisk.map((clause) => (
          <ClauseCard key={clause.id} clause={clause} initialRiskAnalysis={clause.risk!} />
        ))}
      </div>
    </div>
  );
}
