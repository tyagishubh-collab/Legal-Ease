import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-clauses.ts';
import '@/ai/flows/explain-clauses-for-roles.ts';
import '@/ai/flows/answer-contract-questions.ts';
import '@/ai/flows/analyze-clause-risk.ts';
import '@/ai/flows/suggest-clause-rewrite.ts';
