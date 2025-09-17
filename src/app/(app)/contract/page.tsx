'use client';

import { useState } from 'react';
import { contract } from '@/lib/data';
import { ClauseCard } from '@/components/contract/clause-card';
import { FileText, UploadCloud } from 'lucide-react';
import type { Clause, RiskAnalysis } from '@/lib/types';
import { FileUploader } from '@/components/contract/file-uploader';
import { Button } from '@/components/ui/button';
import { ClauseModal } from '@/components/contract/clause-modal';

export default function ContractPage() {
  const [documentTitle, setDocumentTitle] = useState(contract.title);
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);

  const riskAnalyses: (RiskAnalysis & { clauseId: string })[] = contract.riskAnalyses;

  const clausesWithRisk = contract.clauses.map(clause => {
    const risk = riskAnalyses.find(r => r.clauseId === clause.id);
    return { ...clause, risk: risk! };
  });

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name);
    setDocumentTitle(file.name);
  };
  
  const handleClauseClick = (clause: Clause) => {
    setSelectedClause(clause);
  };

  const handleModalClose = () => {
    setSelectedClause(null);
  };

  return (
    <>
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
               <div onClick={(e) => e.stopPropagation()}>
                <Button>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Document
                </Button>
               </div>
            </FileUploader>
          </div>
          <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clausesWithRisk.map((clause) => (
                    <ClauseCard 
                      key={clause.id} 
                      clause={clause} 
                      onClick={() => handleClauseClick(clause)} 
                    />
                  ))}
              </div>
          </div>
        </div>
      </div>
      {selectedClause && (
         <ClauseModal 
            clause={selectedClause} 
            isOpen={!!selectedClause} 
            onClose={handleModalClose} 
         />
       )}
    </>
  );
}
