'use client';

import { useState } from 'react';
import { contract } from '@/lib/data';
import { ClauseCard } from '@/components/contract/clause-card';
import type { Clause, RiskAnalysis } from '@/lib/types';
import { Dropzone } from '@/components/contract/dropzone';
import { ClauseModal } from '@/components/contract/clause-modal';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';

export default function ContractPage() {
  const [documentTitle, setDocumentTitle] = useState(contract.title);
  const [clauses, setClauses] = useState(contract.clauses);
  const [riskAnalyses, setRiskAnalyses] = useState(contract.riskAnalyses);
  const [selectedClause, setSelectedClause] = useState<Clause & { risk: RiskAnalysis } | null>(null);

  const clausesWithRisk = clauses.map(clause => {
    const risk = riskAnalyses.find(r => r.clauseId === clause.id);
    return { ...clause, risk: risk! };
  });

  const handleFileSelect = (file: File) => {
    console.log('File selected:', file.name);
    setDocumentTitle(file.name);
    // Here you would typically process the file and update clauses
  };
  
  const handleClauseClick = (clause: Clause & { risk: RiskAnalysis }) => {
    setSelectedClause(clause);
  };

  const handleModalClose = () => {
    setSelectedClause(null);
  };

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        <Dropzone onFileSelect={handleFileSelect} />
        
        <Card>
          <CardHeader>
            <CardTitle>{documentTitle}</CardTitle>
            <CardDescription>A clause-by-clause analysis of your document.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion 
              type="single" 
              collapsible 
              className="flex flex-wrap gap-4"
            >
              {clausesWithRisk.map((clause) => (
                <ClauseCard 
                  key={clause.id} 
                  clause={clause} 
                  onClick={() => handleClauseClick(clause)} 
                />
              ))}
            </Accordion>
          </CardContent>
        </Card>
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
