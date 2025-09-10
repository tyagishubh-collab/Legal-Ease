'use server';

/**
 * @fileOverview Explains clauses for different roles (lawyer, entrepreneur, student).
 *
 * - explainClauseForRole - A function that explains a clause from a legal document based on the user's role.
 * - ExplainClauseForRoleInput - The input type for the explainClauseForRole function.
 * - ExplainClauseForRoleOutput - The return type for the explainClauseForRole function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainClauseForRoleInputSchema = z.object({
  clauseText: z.string().describe('The text of the clause to explain.'),
  userRole: z
    .enum(['lawyer', 'entrepreneur', 'student'])
    .describe('The role of the user.'),
});
export type ExplainClauseForRoleInput = z.infer<
  typeof ExplainClauseForRoleInputSchema
>;

const ExplainClauseForRoleOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A plain English explanation of the clause, tailored to the user role.'
    ),
});
export type ExplainClauseForRoleOutput = z.infer<
  typeof ExplainClauseForRoleOutputSchema
>;

export async function explainClauseForRole(
  input: ExplainClauseForRoleInput
): Promise<ExplainClauseForRoleOutput> {
  return explainClauseForRoleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainClauseForRolePrompt',
  input: {schema: ExplainClauseForRoleInputSchema},
  output: {schema: ExplainClauseForRoleOutputSchema},
  prompt: `You are an expert legal summarizer who can explain legal clauses to different audiences.

You will be provided with a clause from a legal document, and the role of the person who needs the explanation.

Based on their role, you will explain the clause in a way that is easy for them to understand. Consider the user's existing level of knowledge and what aspects of the clause are most relevant to them.

Clause: {{{clauseText}}}
User Role: {{{userRole}}}

Explanation:`,
});

const explainClauseForRoleFlow = ai.defineFlow(
  {
    name: 'explainClauseForRoleFlow',
    inputSchema: ExplainClauseForRoleInputSchema,
    outputSchema: ExplainClauseForRoleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
