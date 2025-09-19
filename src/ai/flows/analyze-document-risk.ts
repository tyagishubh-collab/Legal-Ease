'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a contract document and categorizing its clauses by risk level.
 *
 * The flow takes a document as input and returns a structured object containing arrays of clauses for high, medium, and low risk categories.
 *   - analyzeDocumentRisk - A function that analyzes the risk of clauses in a document.
 */

import {ai} from '@/ai/genkit';
import {
    AnalyzeDocumentRiskInput,
    AnalyzeDocumentRiskOutput,
    AnalyzeDocumentRiskInputSchema,
    AnalyzeDocumentRiskOutputSchema,
} from '@/lib/types';


export async function analyzeDocumentRisk(
  input: AnalyzeDocumentRiskInput
): Promise<AnalyzeDocumentRiskOutput> {
  return analyzeDocumentRiskFlow(input);
}

const analyzeDocumentRiskPrompt = ai.definePrompt({
  name: 'analyzeDocumentRiskPrompt',
  input: {schema: AnalyzeDocumentRiskInputSchema},
  output: {schema: AnalyzeDocumentRiskOutputSchema},
  prompt: `You are an expert legal AI specializing in contract risk analysis.

You will be given a contract document. Your task is to:
1.  Read and parse the entire document.
2.  Identify the individual clauses within the document. A clause typically has a numbered or lettered heading and a body of text.
3.  For each clause, determine its risk level for a party signing the agreement.
4.  Categorize each identified clause into one of three risk levels: High, Medium, or Low.

The risk categories are:
- **High Risk**: Clauses that contain unfavorable terms, ambiguities, uncapped liabilities, one-sided indemnifications, or other significant potential dangers.
- **Medium Risk**: Clauses that are largely standard but could pose some risk or require negotiation. This includes things like standard but broad confidentiality clauses, or termination clauses with some notification periods.
- **Low Risk**: Standard, boilerplate clauses that pose little to no risk, such as governing law, notices, or definitions.

For each clause you identify, you must extract its title and full text, and place it into the appropriate risk category array in the output format.

Analyze the following document:
{{media url=documentDataUri}}
`,
});

const analyzeDocumentRiskFlow = ai.defineFlow(
  {
    name: 'analyzeDocumentRiskFlow',
    inputSchema: AnalyzeDocumentRiskInputSchema,
    outputSchema: AnalyzeDocumentRiskOutputSchema,
  },
  async input => {
    const {output} = await analyzeDocumentRiskPrompt(input);
    return output!;
  }
);
