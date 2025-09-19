'use server';

import { z } from 'zod';
import type { Summary, Explanation, RiskAnalysis, SuggestedRewrite, AnalyzeDocumentRiskOutput } from './types';
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
import { analyzeDocumentRisk } from '@/ai/flows/analyze-document-risk';
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
  file: z.instanceof(File).optional(),
});

export async function answerQuestionAction(
  input: z.infer<typeof answerSchema>
): Promise<{ answer: string }> {
  const validatedInput = answerSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for answerQuestionAction');
  }
  
  const { question, file } = validatedInput.data;
  const aiInput: AnswerContractQuestionsInput = {
    question: question,
    relevantClauses: [],
  };

  if (file) {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    aiInput.documentDataUri = `data:${file.type};base64,${base64}`;
  } else {
    // Fallback to using all clauses if no file is provided
    aiInput.relevantClauses = contract.clauses.map(
      (c) => `Clause: ${c.title}\nText: ${c.text}`
    );
  }

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

const analyzeDocumentSchema = z.object({
  file: z.instanceof(File),
});

export async function analyzeDocumentAction(
  input: z.infer<typeof analyzeDocumentSchema>
): Promise<AnalyzeDocumentRiskOutput> {
  const validatedInput = analyzeDocumentSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for analyzeDocumentAction');
  }

  const { file } = validatedInput.data;
  
  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString('base64');
  const documentDataUri = `data:${file.type};base64,${base64}`;

  return await analyzeDocumentRisk({ documentDataUri });
}
