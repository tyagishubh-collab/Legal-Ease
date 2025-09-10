'use client';
import { useState, useTransition } from 'react';
import type { Clause, RiskAnalysis, Explanation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  explainClauseForRoleAction,
  suggestClauseRewriteAction,
  analyzeClauseRiskAction,
} from '@/lib/actions';
import { Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

interface ClauseDrilldownModalProps {
  clauses: (Clause & { risk?: RiskAnalysis })[];
  onClauseUpdate: (clauseId: string, newText: string, newRisk: RiskAnalysis) => void;
}

export function ClauseDrilldownModal({
  clauses,
  onClauseUpdate,
}: ClauseDrilldownModalProps) {
  const [selectedClause, setSelectedClause] = useState(clauses[0]);
  const [editedText, setEditedText] = useState(selectedClause.text);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [suggestedRewrite, setSuggestedRewrite] = useState<string | null>(null);
  const [isExplanationLoading, startExplanationTransition] = useTransition();
  const [isRewriteLoading, startRewriteTransition] = useTransition();
  const [isAnalysisLoading, startAnalysisTransition] = useTransition();
  const { toast } = useToast();

  const handleClauseSelect = (clause: Clause) => {
    setSelectedClause(clause);
    setEditedText(clause.text);
    setExplanation(null);
    setSuggestedRewrite(null);
  };

  const getExplanation = () => {
    startExplanationTransition(async () => {
      const result = await explainClauseForRoleAction({
        clauseText: selectedClause.text,
        userRole: 'entrepreneur',
      });
      setExplanation(result);
    });
  };

  const getRewrite = () => {
    startRewriteTransition(async () => {
      const result = await suggestClauseRewriteAction({
        clauseText: selectedClause.text,
      });
      setSuggestedRewrite(result.suggestedRewrite);
    });
  };
  
  const handleRecalculate = () => {
    startAnalysisTransition(async () => {
      const newRisk = await analyzeClauseRiskAction({ clause: editedText });
      onClauseUpdate(selectedClause.id, editedText, newRisk);
      toast({
        title: "Analysis Updated",
        description: "The clause risk and overall score have been recalculated.",
      });
    });
  }

  const copyRewrite = () => {
    if (suggestedRewrite) {
      navigator.clipboard.writeText(suggestedRewrite);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  return (
    <div className="flex h-full gap-6 pt-4">
      <div className="w-1/3 border-r pr-6">
        <h3 className="text-lg font-semibold mb-2">Clauses</h3>
        <ScrollArea className="h-[calc(80vh-80px)]">
          <div className="space-y-2">
            {clauses.map((clause) => (
              <Button
                key={clause.id}
                variant={selectedClause.id === clause.id ? 'secondary' : 'ghost'}
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => handleClauseSelect(clause)}
              >
                {clause.title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="w-2/3">
        <ScrollArea className="h-[calc(80vh-80px)] pr-4">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Original Clause</h4>
              <Textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="h-32 text-sm"
              />
               <Button onClick={handleRecalculate} disabled={isAnalysisLoading} className="mt-2">
                {isAnalysisLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Recalculate Risk (What-If)
              </Button>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">AI Explanation</h4>
                <Button variant="outline" size="sm" onClick={getExplanation} disabled={isExplanationLoading}>
                  {isExplanationLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Explain'}
                </Button>
              </div>
              <div className="p-4 rounded-md border bg-muted/50 min-h-[100px]">
                {isExplanationLoading && <Skeleton className="h-16 w-full" />}
                {explanation ? (
                  <p className="text-sm">{explanation.explanation}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Click &quot;Explain&quot; to get an AI-powered explanation.</p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Suggested Rewrite</h4>
                 <Button variant="outline" size="sm" onClick={getRewrite} disabled={isRewriteLoading}>
                   {isRewriteLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Suggest Rewrite'}
                 </Button>
              </div>
              <div className="p-4 rounded-md border bg-muted/50 min-h-[120px]">
                {isRewriteLoading && <Skeleton className="h-24 w-full" />}
                {suggestedRewrite ? (
                  <>
                    <p className="text-sm">{suggestedRewrite}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={copyRewrite}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Click &quot;Suggest Rewrite&quot; for an improved version.</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
