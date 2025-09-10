'use server';

/**
 * @fileOverview A flow that answers questions about a contract, referencing specific contract clauses.
 *
 * - answerContractQuestions - A function that answers questions about the contract.
 * - AnswerContractQuestionsInput - The input type for the answerContractQuestions function.
 * - AnswerContractQuestionsOutput - The return type for the answerContractQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerContractQuestionsInputSchema = z.object({
  question: z.string().describe('The question about the contract.'),
  relevantClauses: z.array(z.string()).describe('The relevant contract clauses retrieved from vector database.'),
});

export type AnswerContractQuestionsInput = z.infer<typeof AnswerContractQuestionsInputSchema>;

const AnswerContractQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question, referencing specific contract clauses.'),
});

export type AnswerContractQuestionsOutput = z.infer<typeof AnswerContractQuestionsOutputSchema>;

export async function answerContractQuestions(input: AnswerContractQuestionsInput): Promise<AnswerContractQuestionsOutput> {
  return answerContractQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerContractQuestionsPrompt',
  input: {schema: AnswerContractQuestionsInputSchema},
  output: {schema: AnswerContractQuestionsOutputSchema},
  prompt: `You are an AI assistant that answers questions about a contract. Use the following relevant contract clauses to answer the question.  Cite the specific clauses used to answer the question.

Relevant Clauses:
{{#each relevantClauses}}
- {{{this}}}
{{/each}}

Question: {{{question}}}`,
});

const answerContractQuestionsFlow = ai.defineFlow(
  {
    name: 'answerContractQuestionsFlow',
    inputSchema: AnswerContractQuestionsInputSchema,
    outputSchema: AnswerContractQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
