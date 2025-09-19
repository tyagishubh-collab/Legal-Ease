'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, FileUp, Sparkles } from 'lucide-react';
import type { AnalyzeDocumentRiskOutput } from '@/lib/types';
import { AnalysisResult } from '@/components/contract/analysis-result';
import { analyzeDocumentAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Dropzone } from '@/components/contract/dropzone';

export default function ContractPage() {
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDocumentRiskOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAnalysis = () => {
    if (!selectedFile) return;

    startTransition(async () => {
      setError(null);
      setAnalysisResult(null);
      try {
        const result = await analyzeDocumentAction({ file: selectedFile });
        setAnalysisResult(result);
      } catch (e) {
        setError('An error occurred during analysis. Please try again.');
        console.error(e);
      }
    });
  };
  
  if (isPending) {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <CardTitle>Analyzing Document</CardTitle>
                    <CardDescription>
                    Our AI is reviewing your document, please hang tight...
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                    <p className="mt-4 text-sm text-muted-foreground">This can take up to a minute.</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (analysisResult) {
    return (
        <div className="w-full min-h-screen flex flex-col bg-background">
            <div className="p-4 sm:p-6 lg:p-8 border-b">
                <h1 className="text-3xl font-bold tracking-tight">{selectedFile?.name}</h1>
                <p className="mt-2 text-muted-foreground">
                Analysis complete. Review the clauses below.
                </p>
            </div>
            <div className="flex-1 w-full p-4 sm:p-6 lg:p-8">
                <div className="w-full">
                    <Card>
                        <AnalysisResult result={analysisResult} />
                    </Card>
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="w-full min-h-[calc(100vh-theme(spacing.16))] flex flex-col items-center justify-center p-4">
      <div className="w-full flex-1 flex flex-col items-center justify-center gap-6">
          <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight">Contract Analysis</h1>
              <p className="mt-2 text-muted-foreground max-w-xl">
                  Upload a document to get a clause-by-clause risk analysis powered by AI.
              </p>
          </div>
        <Dropzone onFileSelect={setSelectedFile} selectedFile={selectedFile} onClear={() => setSelectedFile(null)} />
        <Button onClick={handleAnalysis} disabled={!selectedFile} size="lg">
          <Sparkles className="mr-2 h-4 w-4" />
          Analyze Document
        </Button>
      </div>
      {error && (
        <Card className="bg-destructive/10 border-destructive text-center mt-4">
          <CardHeader>
            <CardTitle className="text-destructive">Analysis Failed</CardTitle>
            <CardDescription className="text-destructive/80">{error}</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
