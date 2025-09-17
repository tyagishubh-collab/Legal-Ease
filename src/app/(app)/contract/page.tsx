'use client';

import { useState } from 'react';
import { contract } from '@/lib/data';
import { ClauseCard } from '@/components/contract/clause-card';
import { FileText, UploadCloud } from 'lucide-react';
import type { RiskAnalysis } from '@/lib/types';
import { Dropzone } from '@/components/contract/dropzone';
import { FileUploader } from '@/components/contract/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContractPage() {
  const [documentTitle, setDocumentTitle] = useState(contract.title);
  const riskAnalyses: (RiskAnalysis & { clauseId: string })[] = contract.riskAnalyses;

  const clausesWithRisk = contract.clauses.map(clause => {
    const risk = riskAnalyses.find(r => r.clauseId === clause.id);
    return { ...clause, risk };
  });

  const handleFileSelect = (file: File) => {
    // In a real app, you would handle the file upload here.
    // For example, upload to a server or process on the client.
    console.log('File selected:', file.name);
    setDocumentTitle(file.name);
  };

  return (
    <div className="bg-muted/20 min-h-full">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-muted-foreground mt-1" />
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                {documentTitle}
              </h1>
              <p className="mt-1 text-muted-foreground">
                A clause-by-clause analysis of your document.
              </p>
            </div>
          </div>
          <FileUploader onFileSelect={handleFileSelect} showFile>
            <Button>
              <UploadCloud className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </FileUploader>
        </div>
        <div className="mt-8">
            <Dropzone onFileSelect={handleFileSelect}>
                <Card>
                    <CardHeader>
                        <CardTitle>Contract Clauses</CardTitle>
                        <CardDescription>Review each clause and its associated risk analysis below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {clausesWithRisk.map((clause) => (
                              <ClauseCard key={clause.id} clause={clause} initialRiskAnalysis={clause.risk!} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </Dropzone>
        </div>
      </div>
    </div>
  );
}
