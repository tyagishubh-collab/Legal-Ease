'use server';

/**
 * @fileOverview Summarizes legal clauses into plain English and bullet points at different levels of detail.
 *
 * - summarizeClause - A function that summarizes a legal clause.
 * - SummarizeClauseInput - The input type for the summarizeClause function.
 * - SummarizeClauseOutput - The return type for the summarizeClause function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeClauseInputSchema = z.object({
  clauseText: z
    .string()
    .describe('The legal clause text to summarize.'),
  detailLevel: z.enum(['short', 'medium', 'verbose']).describe('The level of detail for the summary.'),
});
export type SummarizeClauseInput = z.infer<typeof SummarizeClauseInputSchema>;

const SummarizeClauseOutputSchema = z.object({
  summary: z.string().describe('The plain English summary of the clause.'),
  bulletPoints: z.array(z.string()).describe('Key bullet points extracted from the clause.'),
});
export type SummarizeClauseOutput = z.infer<typeof SummarizeClauseOutputSchema>;

export async function summarizeClause(input: SummarizeClauseInput): Promise<SummarizeClauseOutput> {
  return summarizeClauseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeClausePrompt',
  input: {schema: SummarizeClauseInputSchema},
  output: {schema: SummarizeClauseOutputSchema},
  prompt: `You are an expert legal summarizer, skilled at explaining complex legal clauses in plain English.

  Summarize the following legal clause into a plain English summary and extract key bullet points.
  The level of detail should be {{{detailLevel}}}.

  Clause Text: {{{clauseText}}}

  Summary:
  Bullet Points:`, // Ensure bullet points are valid in markdown
});

const summarizeClauseFlow = ai.defineFlow(
  {
    name: 'summarizeClauseFlow',
    inputSchema: SummarizeClauseInputSchema,
    outputSchema: SummarizeClauseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Optionally post-process the output here if needed
    return output!;
  }
);
