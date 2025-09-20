'use client';

import type { AnalyzeDocumentSafetyOutput } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SafetyScore } from "../dashboard/safety-score";
import { AlertTriangle } from "lucide-react";

interface SafetySummaryProps {
    result: AnalyzeDocumentSafetyOutput;
}

export function SafetySummary({ result }: SafetySummaryProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
                <CardDescription>An AI-generated overview of your document's safety.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="flex justify-center">
                    <SafetyScore value={result.safetyScore} />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                     <div className="flex items-start gap-4 p-4 border rounded-lg bg-amber-500/10 border-amber-500/30">
                        <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
                        <div>
                            <h3 className="font-semibold text-foreground">Key Risk Identified</h3>
                            <p className="text-muted-foreground mt-1">{result.keyRisk}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
