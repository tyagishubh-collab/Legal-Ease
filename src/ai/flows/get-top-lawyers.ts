'use server';
/**
 * @fileOverview A Genkit flow to find top-rated lawyers near a given location using the Google Places API.
 *
 * - getTopLawyers - A function that fetches nearby lawyers.
 * - GetTopLawyersInput - The input type for the getTopLawyers function.
 * - GetTopLawyersOutput - The return type for the getTopLawyers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
    GetTopLawyersInput,
    GetTopLawyersInputSchema,
    GetTopLawyersOutput,
    GetTopLawyersOutputSchema
} from '@/lib/types';


// This is a placeholder for the actual Google Places API tool.
// In a real implementation, this tool would make an HTTP request to the Places API.
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
              formatted_address: z.string().optional(),
              place_id: z.string(),
          }))
      }),
    },
    async ({ lat, lng }) => {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) {
            console.error("GOOGLE_PLACES_API_KEY is not set.");
            // Return an empty array or throw an error if the key is missing
            return { results: [] };
        }
        
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=prominence&radius=5000&keyword=lawyer&key=${apiKey}&fields=name,rating,formatted_address,place_id,vicinity`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`Google Places API request failed with status ${response.status}: ${errorBody}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch from Google Places API:", error);
            // In case of a network error or other fetch-related issue
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
            address: lawyer.formatted_address || lawyer.vicinity || 'Address not available',
            placeId: lawyer.place_id,
        }))
        .sort((a, b) => b.rating - a.rating) // Sort by rating descending
        .slice(0, 10); // Return top 10

    return { lawyers };
  }
);
