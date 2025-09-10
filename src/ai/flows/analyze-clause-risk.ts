'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing the risk associated with a given clause.
 *
 * The flow takes a clause as input and returns a risk score and a color code indicating the risk level.
 *   - analyzeClauseRisk - A function that analyzes the risk of a clause.
 *   - AnalyzeClauseRiskInput - The input type for the analyzeClauseRisk function.
 *   - AnalyzeClauseRiskOutput - The return type for the analyzeClauseRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeClauseRiskInputSchema = z.object({
  clause: z.string().describe('The clause to analyze.'),
});
export type AnalyzeClauseRiskInput = z.infer<typeof AnalyzeClauseRiskInputSchema>;

const AnalyzeClauseRiskOutputSchema = z.object({
  riskScore: z.number().describe('The risk score of the clause (0-100).'),
  riskLevel: z
    .enum(['high', 'medium', 'low'])
    .describe('The risk level of the clause.'),
  colorCode: z
    .string()
    .describe('The color code associated with the risk level (red, amber, green).'),
});
export type AnalyzeClauseRiskOutput = z.infer<typeof AnalyzeClauseRiskOutputSchema>;

export async function analyzeClauseRisk(input: AnalyzeClauseRiskInput): Promise<AnalyzeClauseRiskOutput> {
  return analyzeClauseRiskFlow(input);
}

const analyzeClauseRiskPrompt = ai.definePrompt({
  name: 'analyzeClauseRiskPrompt',
  input: {schema: AnalyzeClauseRiskInputSchema},
  output: {schema: AnalyzeClauseRiskOutputSchema},
  prompt: `You are a legal risk assessment expert.

You will analyze the provided clause and determine its risk score, risk level, and corresponding color code.

Clause: {{{clause}}}

Consider keywords, potential liabilities, and overall impact when determining the risk.

Output the riskScore between 0 and 100, riskLevel as one of "high", "medium", or "low", and colorCode as one of "red", "amber", or "green".
`,
});

const analyzeClauseRiskFlow = ai.defineFlow(
  {
    name: 'analyzeClauseRiskFlow',
    inputSchema: AnalyzeClauseRiskInputSchema,
    outputSchema: AnalyzeClauseRiskOutputSchema,
  },
  async input => {
    const {output} = await analyzeClauseRiskPrompt(input);
    return output!;
  }
);
