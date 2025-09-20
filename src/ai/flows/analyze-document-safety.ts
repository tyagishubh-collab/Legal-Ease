'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a contract document to generate a safety score and identify the single most important risk.
 *
 * The flow takes a document as input and returns a safety score and a brief description of the key risk.
 *   - analyzeDocumentSafety - A function that performs the safety analysis.
 *   - AnalyzeDocumentSafetyInput - The input type for the analyzeDocumentSafety function.
 *   - AnalyzeDocumentSafetyOutput - The return type for the analyzeDocumentSafety function.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeDocumentSafetyInput,
  AnalyzeDocumentSafetyOutput,
  AnalyzeDocumentSafetyInputSchema,
  AnalyzeDocumentSafetyOutputSchema,
} from '@/lib/types';


export async function analyzeDocumentSafety(
  input: AnalyzeDocumentSafetyInput
): Promise<AnalyzeDocumentSafetyOutput> {
  return analyzeDocumentSafetyFlow(input);
}

const analyzeDocumentSafetyPrompt = ai.definePrompt({
  name: 'analyzeDocumentSafetyPrompt',
  input: {schema: AnalyzeDocumentSafetyInputSchema},
  output: {schema: AnalyzeDocumentSafetyOutputSchema},
  prompt: `You are an expert legal AI specializing in contract risk analysis.

You will be given a contract document. Your task is to:
1.  Read the entire document to understand its purpose and terms.
2.  Calculate an overall "safety score" for the person signing this document, on a scale of 0 to 100, where 100 is perfectly safe and 0 is extremely risky.
3.  Identify the single most important or critical risk in the document.
4.  Summarize this key risk in a single, concise sentence.

Analyze the following document:
{{#if documentDataUri}}
{{media url=documentDataUri}}
{{else}}
{{{documentText}}}
{{/if}}
`,
});

const analyzeDocumentSafetyFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentSafetyFlow',
    inputSchema: AnalyzeDocumentSafetyInputSchema,
    outputSchema: AnalyzeDocumentSafetyOutputSchema,
  },
  async input => {
    const {output} = await analyzeDocumentSafetyPrompt(input);
    return output!;
  }
);
