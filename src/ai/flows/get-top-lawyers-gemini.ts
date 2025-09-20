'use server';
/**
 * @fileOverview A Genkit flow that uses Gemini to find top lawyers in a city.
 *
 * - getTopLawyers - A function that fetches lawyers using a generative model.
 */

import { ai } from '@/ai/genkit';
import {
  GetTopLawyersInput,
  GetTopLawyersInputSchema,
  GetTopLawyersOutput,
  GetTopLawyersOutputSchema,
} from '@/lib/types';


export async function getTopLawyers(
  input: GetTopLawyersInput
): Promise<GetTopLawyersOutput> {
  return getTopLawyersGeminiFlow(input);
}

const getTopLawyersGeminiPrompt = ai.definePrompt({
  name: 'getTopLawyersGeminiPrompt',
  input: { schema: GetTopLawyersInputSchema },
  output: { schema: GetTopLawyersOutputSchema },
  prompt: `You are an expert local search assistant. Your task is to find the top-rated lawyers or law firms in the specified city.

City: {{{cityName}}}

Search for highly-rated lawyers on Google Maps and return a structured JSON array. Each object in the array should represent a lawyer or firm and include the following fields:
- "name": The full name of the law firm or lawyer.
- "address": The full street address.
- "rating": The numerical rating (e.g., 4.8), if available. Default to 0 if not found.
- "placeId": The Google Place ID for the location. This is very important.
`,
});

const getTopLawyersGeminiFlow = ai.defineFlow(
  {
    name: 'getTopLawyersGeminiFlow',
    inputSchema: GetTopLawyersInputSchema,
    outputSchema: GetTopLawyersOutputSchema,
  },
  async (input) => {
    console.log(`[get-top-lawyers-gemini] Starting Gemini search for city: ${input.cityName}`);
    try {
      const { output } = await getTopLawyersGeminiPrompt(input);
      if (!output || !output.lawyers) {
        console.log('[get-top-lawyers-gemini] Gemini returned no lawyers.');
        return { lawyers: [] };
      }
      console.log(`[get-top-lawyers-gemini] Gemini found ${output.lawyers.length} lawyers.`);
      // Sort by rating descending
      const sortedLawyers = output.lawyers.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      return { lawyers: sortedLawyers };
    } catch (error) {
      console.error('[get-top-lawyers-gemini] Error during Gemini search:', error);
      return { lawyers: [] };
    }
  }
);
