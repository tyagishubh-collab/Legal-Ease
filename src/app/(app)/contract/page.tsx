'use client';

import { useState, useTransition } from 'react';
import { Dropzone } from '@/components/contract/dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { analyzeDocumentRiskAction } from '@/lib/actions';
import type { AnalyzeDocumentRiskOutput } from '@/lib/types';
import { AnalysisResult } from '@/components/contract/analysis-result';

export default function ContractPage() {
  const [documentTitle, setDocumentTitle] = useState('Contract Analysis');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [analysisResult, setAnalysisResult] = useState<AnalyzeDocumentRiskOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setDocumentTitle(file.name);
    setAnalysisResult(null);
    setError(null);
  };

  const handleGenerate = () => {
    if (!selectedFile) return;

    startTransition(async () => {
      setError(null);
      setAnalysisResult(null);
      try {
        const result = await analyzeDocumentRiskAction({ file: selectedFile });
        setAnalysisResult(result);
      } catch (e) {
        setError('An error occurred during analysis. Please try again.');
        console.error(e);
      }
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* === Main Content === */}
      <main className="flex-1 flex flex-col">
        {/* Page header */}
        <div className="w-full text-center py-8 px-6">
          <h1 className="text-3xl font-bold tracking-tight">{documentTitle}</h1>
          <p className="mt-2 text-muted-foreground">
            {analysisResult
              ? 'Analysis complete. Review the clauses below.'
              : 'Upload a document to begin analysis.'}
          </p>
        </div>

        {/* Body */}
        <div className="flex-grow overflow-auto space-y-8 px-6 w-full mx-auto">
          <Card>
            <CardContent className="p-6">
              <Dropzone onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={handleGenerate} disabled={!selectedFile || isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Analyzing...' : 'Generate Analysis'}
            </Button>
          </div>

          <div className="space-y-8">
            {error && (
              <Card className="bg-destructive/10 border-destructive text-center">
                <CardHeader>
                  <CardTitle className="text-destructive">Analysis Failed</CardTitle>
                  <CardDescription className="text-destructive/80">{error}</CardDescription>
                </CardHeader>
              </Card>
            )}

            {isPending && (
              <Card>
                <CardHeader>
                  <CardTitle>Analyzing Document</CardTitle>
                  <CardDescription>
                    AI is reviewing your document, please wait...
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            )}

            {analysisResult && <AnalysisResult result={analysisResult} />}
          </div>
        </div>
      </main>
    </div>
  );
}
