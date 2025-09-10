'use server';

import {
  summarizeClause,
  SummarizeClauseInput,
} from '@/ai/flows/summarize-clauses';
import {
  explainClauseForRole,
  ExplainClauseForRoleInput,
} from '@/ai/flows/explain-clauses-for-roles';
import {
  answerContractQuestions,
} from '@/ai/flows/answer-contract-questions';
import { contract } from './data';
import { z } from 'zod';

const summarizeSchema = z.object({
  clauseText: z.string(),
  detailLevel: z.enum(['short', 'medium', 'verbose']),
});

export async function summarizeClauseAction(input: SummarizeClauseInput) {
  const validatedInput = summarizeSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for summarizeClauseAction');
  }
  return await summarizeClause(validatedInput.data);
}

const explainSchema = z.object({
  clauseText: z.string(),
  userRole: z.enum(['lawyer', 'entrepreneur', 'student']),
});

export async function explainClauseForRoleAction(
  input: ExplainClauseForRoleInput
) {
  const validatedInput = explainSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for explainClauseForRoleAction');
  }
  return await explainClauseForRole(validatedInput.data);
}

const answerSchema = z.object({
  question: z.string(),
});

export async function answerQuestionAction(
  input: z.infer<typeof answerSchema>
) {
  const validatedInput = answerSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for answerQuestionAction');
  }

  // In a real app, this would perform a vector search to find relevant clauses.
  // For this demo, we'll just use all clauses from the mock data.
  const relevantClauses = contract.clauses.map(
    (c) => `Clause "${c.title}": ${c.text}`
  );

  return await answerContractQuestions({
    question: validatedInput.data.question,
    relevantClauses,
  });
}
