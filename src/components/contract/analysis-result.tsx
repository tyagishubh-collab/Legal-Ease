'use client';

import type { AnalyzeDocumentRiskOutput } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "../ui/badge";

interface AnalysisResultProps {
    result: AnalyzeDocumentRiskOutput;
}

type Clause = {
    title: string;
    text: string;
}

export function AnalysisResult({ result }: AnalysisResultProps) {
    const { highRiskClauses, mediumRiskClauses, lowRiskClauses } = result;

    const renderClauseList = (clauses: Clause[], riskLevel: "High" | "Medium" | "Low") => {
        if (!clauses || clauses.length === 0) {
            return <p className="text-muted-foreground text-sm p-4">No {riskLevel.toLowerCase()} risk clauses found.</p>;
        }

        return (
            <Accordion type="single" collapsible className="w-full">
                {clauses.map((clause, index) => (
                    <AccordionItem key={`${riskLevel}-${index}`} value={`item-${index}`}>
                        <AccordionTrigger className="px-6">
                            <span className="text-left font-semibold">{clause.title}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6">
                            <p className="text-muted-foreground">{clause.text}</p>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        );
    }
    
    return (
        <div>
            <CardHeader>
                <CardTitle>Clause-by-Clause Analysis</CardTitle>
                <CardDescription>The AI has categorized the document's clauses by risk level.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="high" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="high">
                            High Risk <Badge variant="destructive" className="ml-2">{highRiskClauses.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="medium">
                            Medium Risk <Badge variant="secondary" className="ml-2 bg-amber-500/80 text-white">{mediumRiskClauses.length}</Badge>
                        </TabsTrigger>
                        <TabsTrigger value="low">
                            Low Risk <Badge variant="secondary" className="ml-2 bg-green-500/80 text-white">{lowRiskClauses.length}</Badge>
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="high">
                        {renderClauseList(highRiskClauses, 'High')}
                    </TabsContent>
                    <TabsContent value="medium">
                        {renderClauseList(mediumRiskClauses, 'Medium')}
                    </TabsContent>
                    <TabsContent value="low">
                        {renderClauseList(lowRiskClauses, 'Low')}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </div>
    )
}
