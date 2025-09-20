'use server';
/**
 * @fileOverview A Genkit flow that uses Gemini to find top lawyers in a city as a fallback.
 *
 * - getTopLawyersFallback - A function that fetches lawyers using a generative model.
 */

import { ai } from '@/ai/genkit';
import {
  GetTopLawyersFallbackInput,
  GetTopLawyersFallbackInputSchema,
  GetTopLawyersFallbackOutput,
  GetTopLawyersFallbackOutputSchema,
} from '@/lib/types';


export async function getTopLawyersFallback(
  input: GetTopLawyersFallbackInput
): Promise<GetTopLawyersFallbackOutput> {
  return getTopLawyersFallbackFlow(input);
}

const getTopLawyersFallbackPrompt = ai.definePrompt({
  name: 'getTopLawyersFallbackPrompt',
  input: { schema: GetTopLawyersFallbackInputSchema },
  output: { schema: GetTopLawyersFallbackOutputSchema },
  prompt: `You are an expert local search assistant. Your task is to find the top-rated lawyers or law firms in the specified city.

City: {{{cityName}}}

Search for highly-rated lawyers on Google Maps and return a structured JSON array. Each object in the array should represent a lawyer or firm and include the following fields:
- "name": The full name of the law firm or lawyer.
- "address": The full street address.
- "rating": The numerical rating (e.g., 4.8), if available. Default to 0 if not found.
- "placeId": The Google Place ID for the location. It is very important to get this.
`,
});

const getTopLawyersFallbackFlow = ai.defineFlow(
  {
    name: 'getTopLawyersFallbackFlow',
    inputSchema: GetTopLawyersFallbackInputSchema,
    outputSchema: GetTopLawyersFallbackOutputSchema,
  },
  async (input) => {
    console.log(`[get-top-lawyers-fallback-gemini] Starting Gemini fallback for city: ${input.cityName}`);
    try {
      const { output } = await getTopLawyersFallbackPrompt(input);
      if (!output || !output.lawyers) {
        console.log('[get-top-lawyers-fallback-gemini] Gemini returned no lawyers.');
        return { lawyers: [] };
      }
      console.log(`[get-top-lawyers-fallback-gemini] Gemini found ${output.lawyers.length} lawyers.`);
      return output;
    } catch (error) {
      console.error('[get-top-lawyers-fallback-gemini] Error during Gemini fallback:', error);
      return { lawyers: [] };
    }
  }
);
