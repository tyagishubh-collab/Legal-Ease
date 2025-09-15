'use server';

import { z } from 'zod';
import type { Summary, Explanation, RiskAnalysis, SuggestedRewrite } from './types';
import {
  SummarizeClauseInput,
  summarizeClause,
} from '@/ai/flows/summarize-clauses';
import {
  ExplainClauseForRoleInput,
  explainClauseForRole,
} from '@/ai/flows/explain-clauses-for-roles';
import {
  SuggestClauseRewriteInput,
  suggestClauseRewrite,
} from '@/ai/flows/suggest-clause-rewrite';
import {
  AnalyzeClauseRiskInput,
  analyzeClauseRisk,
} from '@/ai/flows/analyze-clause-risk';
import {
  AnswerContractQuestionsInput,
  answerContractQuestions,
} from '@/ai/flows/answer-contract-questions';
import { contract } from '@/lib/data';


const summarizeSchema = z.object({
  clauseText: z.string(),
  detailLevel: z.enum(['short', 'medium', 'verbose']),
});

export async function summarizeClauseAction(input: SummarizeClauseInput): Promise<Summary> {
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
): Promise<Explanation> {
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
): Promise<{ answer: string }> {
  const validatedInput = answerSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for answerQuestionAction');
  }

  // For this action, we need to provide the relevant clauses.
  // In a real application, you'd implement a vector search to find relevant clauses.
  // For now, we'll just pass all clauses.
  const relevantClauses = contract.clauses.map(
    (c) => `Clause: ${c.title}\nText: ${c.text}`
  );
  
  const aiInput: AnswerContractQuestionsInput = {
    question: validatedInput.data.question,
    relevantClauses: relevantClauses,
  };

  return await answerContractQuestions(aiInput);
}


const rewriteSchema = z.object({
  clauseText: z.string(),
});

export async function suggestClauseRewriteAction(
  input: SuggestClauseRewriteInput
): Promise<SuggestedRewrite> {
  const validatedInput = rewriteSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for suggestClauseRewriteAction');
  }
  return await suggestClauseRewrite(validatedInput.data);
}

const analyzeRiskSchema = z.object({
  clause: z.string(),
});

export async function analyzeClauseRiskAction(input: AnalyzeClauseRiskInput): Promise<RiskAnalysis> {
  const validatedInput = analyzeRiskSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for analyzeClauseRiskAction');
  }

  return await analyzeClauseRisk(validatedInput.data);
}
