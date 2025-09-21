'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing a contract document to generate key precautions.
 *
 * The flow takes a document as input and returns a list of four key precautions for the user to consider.
 *   - getDocumentPrecautions - A function that performs the precaution analysis.
 *   - GetDocumentPrecautionsInput - The input type for the getDocumentPrecautions function.
 *   - GetDocumentPrecautionsOutput - The return type for the getDocumentPrecautions function.
 */

import {ai} from '@/ai/genkit';
import {
  GetDocumentPrecautionsInput,
  GetDocumentPrecautionsOutput,
  GetDocumentPrecautionsInputSchema,
  GetDocumentPrecautionsOutputSchema,
} from '@/lib/types';


export async function getDocumentPrecautions(
  input: GetDocumentPrecautionsInput
): Promise<GetDocumentPrecautionsOutput> {
  return getDocumentPrecautionsFlow(input);
}

const getDocumentPrecautionsPrompt = ai.definePrompt({
  name: 'getDocumentPrecautionsPrompt',
  input: {schema: GetDocumentPrecautionsInputSchema},
  output: {schema: GetDocumentPrecautionsOutputSchema},
  prompt: `You are an expert legal AI specializing in contract risk analysis.

You will be given a contract document. Your task is to:
1.  Read the entire document to understand its purpose and terms.
2.  Identify the four most important precautions or points of focus for the person signing this document.
3.  Summarize each precaution into a concise, actionable bullet point.

Analyze the following document and return exactly four precautions:
{{#if documentDataUri}}
{{media url=documentDataUri}}
{{else}}
{{{documentText}}}
{{/if}}
`,
});

const getDocumentPrecautionsFlow = ai.defineFlow(
  {
    name: 'getDocumentPrecautionsFlow',
    inputSchema: GetDocumentPrecautionsInputSchema,
    outputSchema: GetDocumentPrecautionsOutputSchema,
  },
  async input => {
    const {output} = await getDocumentPrecautionsPrompt(input);
    return output!;
  }
);
