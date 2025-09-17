'use server';

/**
 * @fileOverview A flow that answers questions about a contract, referencing specific contract clauses or an uploaded document.
 *
 * - answerContractQuestions - A function that answers questions about the contract.
 * - AnswerContractQuestionsInput - The input type for the answerContractQuestions function.
 * - AnswerContractQuestionsOutput - The return type for the answerContractQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerContractQuestionsInputSchema = z.object({
  question: z.string().describe('The question about the contract.'),
  documentDataUri: z
    .string()
    .optional()
    .describe(
      "An uploaded document (e.g., PDF, DOCX), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  relevantClauses: z
    .array(z.string())
    .describe(
      'The relevant contract clauses retrieved from vector database (used if no document is provided).'
    ),
});

export type AnswerContractQuestionsInput = z.infer<
  typeof AnswerContractQuestionsInputSchema
>;

const AnswerContractQuestionsOutputSchema = z.object({
  answer: z
    .string()
    .describe(
      'The answer to the question, referencing specific contract clauses or the document.'
    ),
});

export type AnswerContractQuestionsOutput = z.infer<
  typeof AnswerContractQuestionsOutputSchema
>;

export async function answerContractQuestions(
  input: AnswerContractQuestionsInput
): Promise<AnswerContractQuestionsOutput> {
  return answerContractQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerContractQuestionsPrompt',
  input: {schema: AnswerContractQuestionsInputSchema},
  output: {schema: AnswerContractQuestionsOutputSchema},
  prompt: `You are an AI legal assistant that answers questions about a contract.

  You will be given a question and a context. The context will either be an uploaded document or a set of relevant clauses. Use this context to answer the question.

  {{#if documentDataUri}}
  The user has uploaded a document. Use it as the primary source to answer the question.
  Document: {{media url=documentDataUri}}
  {{else}}
  Use the following relevant contract clauses to answer the question. Cite the specific clauses used to form your answer.
  Relevant Clauses:
  {{#each relevantClauses}}
  - {{{this}}}
  {{/each}}
  {{/if}}

  Question: {{{question}}}`,
});

const answerContractQuestionsFlow = ai.defineFlow(
  {
    name: 'answerContractQuestionsFlow',
    inputSchema: AnswerContractQuestionsInputSchema,
    outputSchema: AnswerContractQuestionsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
