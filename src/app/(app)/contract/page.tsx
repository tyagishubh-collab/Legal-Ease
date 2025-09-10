import { contract } from '@/lib/data';
import { ClauseCard } from '@/components/contract/clause-card';
import { FileText } from 'lucide-react';

export default async function ContractPage() {
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
        {contract.clauses.map((clause) => (
          <ClauseCard key={clause.id} clause={clause} />
        ))}
      </div>
    </div>
  );
}
