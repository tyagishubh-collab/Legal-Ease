import { z } from 'zod';

export type Entity = {
  name: string;
  type: 'Party' | 'Date' | 'Amount' | 'Obligation' | string;
};

export type Clause = {
  id: string;
  title: string;
  text: string;
  entities: Entity[];
};

export type Contract = {
  title: string;
  clauses: Clause[];
};

export type RiskAnalysis = {
  riskScore: number;
  riskLevel: 'high' | 'medium' | 'low';
  colorCode: 'red' | 'amber' | 'green';
};

export type Summary = {
  summary: string;
  bulletPoints: string[];
};

export type Explanation = {
  explanation: string;
};

export type SuggestedRewrite = {
  suggestedRewrite: string;
};

// --- Schemas for AI Flows ---
export const AnalyzeDocumentRiskInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The contract document to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const AnalyzedClauseSchema = z.object({
  title: z.string().describe('The title or heading of the clause.'),
  text: z.string().describe('The full text of the clause.'),
});

export const AnalyzeDocumentRiskOutputSchema = z.object({
  highRiskClauses: z
    .array(AnalyzedClauseSchema)
    .describe('An array of clauses identified as high risk.'),
  mediumRiskClauses: z
    .array(AnalyzedClauseSchema)
    .describe('An array of clauses identified as medium risk.'),
  lowRiskClauses: z
    .array(AnalyzedClauseSchema)
    .describe('An array of clauses identified as low risk.'),
});

// Export inferred types from schemas
export type AnalyzeDocumentRiskInput = z.infer<
  typeof AnalyzeDocumentRiskInputSchema
>;
export type AnalyzeDocumentRiskOutput = z.infer<
  typeof AnalyzeDocumentRiskOutputSchema
>;
