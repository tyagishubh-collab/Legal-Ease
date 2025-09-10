'use server';

/**
 * @fileOverview Suggests a rewrite for a legal clause.
 *
 * - suggestClauseRewrite - A function that suggests a rewrite for a legal clause.
 * - SuggestClauseRewriteInput - The input type for the suggestClauseRewrite function.
 * - SuggestClauseRewriteOutput - The return type for the suggestClauseRewrite function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestClauseRewriteInputSchema = z.object({
  clauseText: z.string().describe('The text of the clause to rewrite.'),
});
export type SuggestClauseRewriteInput = z.infer<
  typeof SuggestClauseRewriteInputSchema
>;

const SuggestClauseRewriteOutputSchema = z.object({
  suggestedRewrite: z
    .string()
    .describe(
      'A rewritten version of the clause that is clearer and less risky.'
    ),
});
export type SuggestClauseRewriteOutput = z.infer<
  typeof SuggestClauseRewriteOutputSchema
>;

export async function suggestClauseRewrite(
  input: SuggestClauseRewriteInput
): Promise<SuggestClauseRewriteOutput> {
  return suggestClauseRewriteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestClauseRewritePrompt',
  input: {schema: SuggestClauseRewriteInputSchema},
  output: {schema: SuggestClauseRewriteOutputSchema},
  prompt: `You are an expert legal drafter. Review the following clause and provide a rewritten version that is clearer, fairer, and less risky for both parties.

Clause: {{{clauseText}}}

Suggested Rewrite:`,
});

const suggestClauseRewriteFlow = ai.defineFlow(
  {
    name: 'suggestClauseRewriteFlow',
    inputSchema: SuggestClauseRewriteInputSchema,
    outputSchema: SuggestClauseRewriteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
