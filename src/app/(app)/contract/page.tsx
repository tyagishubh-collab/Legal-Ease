'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import type { AnalyzeDocumentRiskOutput } from '@/lib/types';
import { AnalysisResult } from '@/components/contract/analysis-result';
import { contract as initialContract } from '@/lib/data';
import { analyzeDocumentRisk } from '@/ai/flows/analyze-document-risk';

export default function ContractPage() {
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDocumentRiskOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startTransition(async () => {
      setError(null);
      setAnalysisResult(null);
      try {
        const result = await analyzeDocumentRisk({ clauses: initialContract.clauses });
        setAnalysisResult(result);
      } catch (e) {
        setError('An error occurred during analysis. Please try again.');
        console.error(e);
      }
    });
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-background">
      <div className="p-4 sm:p-6 lg:p-8 border-b">
        <h1 className="text-3xl font-bold tracking-tight">{initialContract.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {analysisResult
            ? 'Analysis complete. Review the clauses and ask questions below.'
            : 'Analyzing contract...'}
        </p>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 w-full p-4 sm:p-6 lg:p-8">
          <div className="space-y-8">
            {error && (
              <Card className="bg-destructive/10 border-destructive text-center">
                <CardHeader>
                  <CardTitle className="text-destructive">Analysis Failed</CardTitle>
                  <CardDescription className="text-destructive/80">{error}</CardDescription>
                </CardHeader>
              </Card>
            )}

            {isPending && !analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Analyzing Document</CardTitle>
                  <CardDescription>
                    AI is reviewing your document, please wait...
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center p-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                </CardContent>
              </Card>
            )}

            {analysisResult && <AnalysisResult result={analysisResult} />}
          </div>
        </div>
      </div>
    </div>
  );
}
