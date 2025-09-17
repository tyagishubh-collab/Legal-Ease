'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a contract document and categorizing its clauses by risk level.
 *
 * The flow takes a document as input and returns a structured object containing arrays of clauses for high, medium, and low risk categories.
 *   - analyzeDocumentRisk - A function that analyzes the risk of clauses in a document.
 *   - AnalyzeDocumentRiskInput - The input type for the analyzeDocumentRisk function.
 *   - AnalyzeDocumentRiskOutput - The return type for the analyzeDocumentRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeDocumentRiskInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A contract document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeDocumentRiskInput = z.infer<
  typeof AnalyzeDocumentRiskInputSchema
>;

const ClauseSchema = z.object({
  title: z.string().describe('The title or heading of the clause.'),
  text: z.string().describe('The full text of the clause.'),
});

export const AnalyzeDocumentRiskOutputSchema = z.object({
  highRiskClauses: z
    .array(ClauseSchema)
    .describe('An array of clauses identified as high risk.'),
  mediumRiskClauses: z
    .array(ClauseSchema)
    .describe('An array of clauses identified as medium risk.'),
  lowRiskClauses: z
    .array(ClauseSchema)
    .describe('An array of clauses identified as low risk.'),
});
export type AnalyzeDocumentRiskOutput = z.infer<
  typeof AnalyzeDocumentRiskOutputSchema
>;

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

You will be given a contract document. Your task is to meticulously review the entire document, identify every clause, and categorize each one based on its potential risk level for a party signing the agreement.

The risk categories are:
- **High Risk**: Clauses that contain unfavorable terms, ambiguities, uncapped liabilities, one-sided indemnifications, or other significant potential dangers.
- **Medium Risk**: Clauses that are largely standard but could pose some risk or require negotiation. This includes things like standard but broad confidentiality clauses, or termination clauses with some notification periods.
- **Low Risk**: Standard, boilerplate clauses that pose little to no risk, such as governing law, notices, or definitions.

For each clause you identify, you must extract its title and full text. Then, place it into the appropriate risk category array in the output format.

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
