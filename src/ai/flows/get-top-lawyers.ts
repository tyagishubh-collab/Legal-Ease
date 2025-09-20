'use server';
/**
 * @fileOverview A Genkit flow to find top-rated lawyers near a given location using the Google Places API.
 *
 * - getTopLawyers - A function that fetches nearby lawyers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
    GetTopLawyersInput,
    GetTopLawyersInputSchema,
    GetTopLawyersOutput,
    GetTopLawyersOutputSchema
} from '@/lib/types';


const findNearbyLawyersTool = ai.defineTool(
    {
      name: 'findNearbyLawyers',
      description: 'Finds nearby lawyers using Google Places API based on latitude and longitude.',
      inputSchema: GetTopLawyersInputSchema,
      outputSchema: z.object({
          results: z.array(z.object({
              name: z.string(),
              rating: z.number().optional(),
              vicinity: z.string().optional(),
              place_id: z.string(),
          }))
      }),
    },
    async ({ lat, lng }) => {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            console.error("GOOGLE_PLACES_API_KEY is not set.");
            return { results: [] };
        }
        
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=lawyer&key=${apiKey}&fields=name,rating,place_id,vicinity`;

        try {
            const response = await fetch(url);
            const data = await response.json();
             console.log("Google Places API Raw Response:", JSON.stringify(data, null, 2));

            if (!response.ok) {
                throw new Error(`Google Places API request failed with status ${response.status}: ${JSON.stringify(data)}`);
            }
            return data;
        } catch (error) {
            console.error("Failed to fetch from Google Places API:", error);
            return { results: [] };
        }
    }
);


export async function getTopLawyers(input: GetTopLawyersInput): Promise<GetTopLawyersOutput> {
  return getTopLawyersFlow(input);
}

const getTopLawyersFlow = ai.defineFlow(
  {
    name: 'getTopLawyersFlow',
    inputSchema: GetTopLawyersInputSchema,
    outputSchema: GetTopLawyersOutputSchema,
  },
  async (input) => {
    const placesResponse = await findNearbyLawyersTool(input);

    if (!placesResponse || !placesResponse.results) {
        return { lawyers: [] };
    }

    const lawyers = placesResponse.results
        .map(lawyer => ({
            name: lawyer.name,
            rating: lawyer.rating || 0,
            address: lawyer.vicinity || 'Address not available',
            placeId: lawyer.place_id,
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10);

    return { lawyers };
  }
);
