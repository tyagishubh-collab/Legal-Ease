'use server';

import {
  SummarizeClauseInput,
} from '@/ai/flows/summarize-clauses';
import {
  ExplainClauseForRoleInput,
} from '@/ai/flows/explain-clauses-for-roles';
import { contract } from './data';
import { z } from 'zod';
import type { Summary, Explanation } from './types';

const summarizeSchema = z.object({
  clauseText: z.string(),
  detailLevel: z.enum(['short', 'medium', 'verbose']),
});

export async function summarizeClauseAction(input: SummarizeClauseInput): Promise<Summary> {
  const validatedInput = summarizeSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for summarizeClauseAction');
  }
  // MOCK DATA to avoid API calls
  await new Promise(resolve => setTimeout(resolve, 500));
  const { detailLevel } = validatedInput.data;
  if (detailLevel === 'short') {
    return {
      summary: 'This is a short, mock summary of the clause, defining what is considered confidential.',
      bulletPoints: ['Defines "Confidential Information".', 'Covers valuable business info.'],
    };
  }
  if (detailLevel === 'verbose') {
    return {
      summary: 'This is a verbose, mock summary. It explains that any information or material with current or potential commercial value or utility to the Disclosing Party\'s business is defined as "Confidential Information". This includes a non-exhaustive list such as trade secrets, financial data, customer lists, and strategic business plans. It also specifies the procedure for marking information as confidential, requiring written materials to be labeled and oral communications to be confirmed in writing.',
      bulletPoints: [
        'Defines "Confidential Information" as anything with commercial value or utility.',
        'Includes trade secrets, financial info, customer lists, and business strategies.',
        'Requires written materials to be marked as "Confidential".',
        'Requires oral disclosures to be confirmed as confidential in writing shortly after.'
      ],
    };
  }
  return {
    summary: 'This is a medium-detail mock summary. It defines "Confidential Information" as any material with business value, such as trade secrets or customer lists, and outlines how to mark it as confidential.',
    bulletPoints: [
      'Defines "Confidential Information" as anything with commercial value.',
      'Includes examples like trade secrets and business plans.',
      'Specifies labeling requirements for written and oral information.',
    ],
  };
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
  // MOCK DATA to avoid API calls
  await new Promise(resolve => setTimeout(resolve, 500));
  const { userRole } = validatedInput.data;
  if (userRole === 'lawyer') {
    return {
      explanation: "This is a mock explanation for a lawyer. The definition is broad, encompassing any information with commercial value. Note the affirmative duty on the Disclosing Party to label written materials and confirm oral disclosures in writing to ensure protection under this agreement's terms.",
    };
  }
  if (userRole === 'student') {
    return {
      explanation: "This is a mock explanation for a student. This part of the contract just explains what 'Confidential Information' means. Think of it like a secret recipe for a company. The company has to label the information as 'Confidential' so everyone knows to keep it secret.",
    };
  }
  return {
    explanation: "This is a mock explanation for an entrepreneur. This clause defines what you must protect. It's broad, covering everything from your financials to your ideas. Make sure your team understands that if it's not public, it's likely confidential. Pay attention to the requirement to label things; you must follow it to protect your information.",
  };
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
  
  // MOCK DATA to avoid API calls
  await new Promise(resolve => setTimeout(resolve, 1000));

  const question = validatedInput.data.question.toLowerCase();

  if (question.includes('obligations')) {
     return {
        answer: 'This is a mock answer about your obligations. Based on **Clause "Obligations of Receiving Party"**, you are required to hold and maintain the Confidential Information in strictest confidence. You must also restrict access to this information to required personnel and have them sign similar nondisclosure agreements.'
     }
  }

  if (question.includes('term') || question.includes('long')) {
     return {
        answer: 'This is a mock answer about the agreement\'s term. According to **Clause "Term"**, the agreement\'s nondisclosure provisions last until the information is no longer a trade secret or until the Disclosing Party releases you in writing. The agreement is effective from January 1, 2025.'
     }
  }

  return {
    answer: "This is a mock answer. I can answer questions about the contract. For example, you could ask 'What are my obligations?' or 'How long does this agreement last?'"
  };
}
