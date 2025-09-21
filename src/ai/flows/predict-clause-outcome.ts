'use server';

/**
 * @fileOverview Predicts the outcome of a hypothetical situation based on a legal clause.
 *
 * - predictClauseOutcome - A function that predicts the outcome based on a clause and a situation.
 * - PredictClauseOutcomeInput - The input type for the predictClauseOutcome function.
 * - PredictClauseOutcomeOutput - The return type for the predictClauseOutcome function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictClauseOutcomeInputSchema = z.object({
  clauseText: z.string().describe('The text of the clause to analyze.'),
  situation: z.string().describe('The hypothetical situation to consider.'),
});
export type PredictClauseOutcomeInput = z.infer<
  typeof PredictClauseOutcomeInputSchema
>;

const PredictClauseOutcomeOutputSchema = z.object({
  predictedOutcome: z
    .string()
    .describe('The predicted outcome of the hypothetical situation.'),
});
export type PredictClauseOutcomeOutput = z.infer<
  typeof PredictClauseOutcomeOutputSchema
>;

export async function predictClauseOutcome(
  input: PredictClauseOutcomeInput
): Promise<PredictClauseOutcomeOutput> {
  return predictClauseOutcomeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictClauseOutcomePrompt',
  input: {schema: PredictClauseOutcomeInputSchema},
  output: {schema: PredictClauseOutcomeOutputSchema},
  prompt: `You are an expert legal analyst. Given the following legal clause and a hypothetical situation, predict the likely legal or business outcome.

Clause:
"{{{clauseText}}}"

Hypothetical Situation:
"{{{situation}}}"

Based on the clause, what is the predicted outcome?`,
});

const predictClauseOutcomeFlow = ai.defineFlow(
  {
    name: 'predictClauseOutcomeFlow',
    inputSchema: PredictClauseOutcomeInputSchema,
    outputSchema: PredictClauseOutcomeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
