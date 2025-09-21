'use client';

import type { AnalyzeDocumentSafetyOutput, GetDocumentPrecautionsOutput } from "@/lib/types";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SafetyScore } from "../dashboard/safety-score";
import { AlertTriangle } from "lucide-react";

interface SafetySummaryProps {
    result: AnalyzeDocumentSafetyOutput;
    precautions?: GetDocumentPrecautionsOutput;
}

export function SafetySummary({ result, precautions }: SafetySummaryProps) {
    const safetyScoreValue = result?.safetyScore ?? 0;
    const keyRisk = result?.keyRisk ?? "No analysis has been performed yet.";

    return (
        <>
            <CardHeader>
                <CardTitle>Overall Safety Score</CardTitle>
                <CardDescription>An AI-generated overview of your document's safety.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 items-center">
                <div className="flex justify-center">
                    <SafetyScore value={safetyScoreValue} precautions={precautions?.precautions || []} />
                </div>
                <div className="flex flex-col justify-center space-y-4">
                     <div className="flex items-start gap-4 p-4 border rounded-lg bg-card">
                        <AlertTriangle className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-foreground">Key Problem Identified</h3>
                            <p className="text-muted-foreground mt-1 text-sm">{keyRisk}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </>
    )
}
