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
  title:string;
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

export const TopLawyerSchema = z.object({
    name: z.string().describe("The lawyer's or firm's name."),
    rating: z.number().describe('The lawyer\'s rating on Google (1-5).'),
    address: z.string().describe('The full address of the lawyer\'s office.'),
    placeId: z.string().describe('The Google Places ID for the location.'),
});

export type TopLawyer = z.infer<typeof TopLawyerSchema>;

// --- Schemas for AI Flows ---
export const AnalyzeDocumentRiskInputSchema = z.object({
  documentDataUri: z
    .string()
    .optional()
    .describe(
      "The contract document to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentText: z.string().optional().describe('The raw text of the document to analyze.')
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

export const AnalyzeDocumentSafetyInputSchema = z.object({
    documentDataUri: z
      .string()
      .optional()
      .describe(
        "The contract document to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
    documentText: z.string().optional().describe('The raw text of the document to analyze.')
  });
  
  export const AnalyzeDocumentSafetyOutputSchema = z.object({
    safetyScore: z
      .number()
      .describe(
        'An overall safety score for the document, from 0 to 100, where 100 is perfectly safe.'
      ),
    keyRisk: z
      .string()
      .describe('A single, concise sentence summarizing the most critical risk.'),
  });

export const GetTopLawyersInputSchema = z.object({
  lat: z.number().describe("The latitude of the user's location."),
  lng: z.number().describe("The longitude of the user's location."),
});

export const GetTopLawyersOutputSchema = z.object({
  lawyers: z.array(TopLawyerSchema).describe('A list of top-rated lawyers found nearby.'),
});

export const GetApproxLocationOutputSchema = z.object({
  lat: z.number().describe('The estimated latitude.'),
  lng: z.number().describe('The estimated longitude.'),
});

export const GetCityCoordinatesInputSchema = z.object({
    cityName: z.string().describe("The name of the city to geocode."),
});

export const GetCityCoordinatesOutputSchema = z.object({
    lat: z.number().describe('The latitude of the city.'),
    lng: z.number().describe('The longitude of the city.'),
});

// Export inferred types from schemas
export type AnalyzeDocumentRiskInput = z.infer<
  typeof AnalyzeDocumentRiskInputSchema
>;
export type AnalyzeDocumentRiskOutput = z.infer<
  typeof AnalyzeDocumentRiskOutputSchema
>;
export type AnalyzeDocumentSafetyInput = z.infer<
  typeof AnalyzeDocumentSafetyInputSchema
>;
export type AnalyzeDocumentSafetyOutput = z.infer<
  typeof AnalyzeDocumentSafetyOutputSchema
>;
export type GetTopLawyersInput = z.infer<typeof GetTopLawyersInputSchema>;
export type GetTopLawyersOutput = z.infer<typeof GetTopLawyersOutputSchema>;
export type GetApproxLocationOutput = z.infer<typeof GetApproxLocationOutputSchema>;
export type GetCityCoordinatesInput = z.infer<typeof GetCityCoordinatesInputSchema>;
export type GetCityCoordinatesOutput = z.infer<typeof GetCityCoordinatesOutputSchema>;
