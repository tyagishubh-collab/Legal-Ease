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


export async function getTopLawyers(input: GetTopLawyersInput): Promise<GetTopLawyersOutput> {
  return getTopLawyersFlow(input);
}

const getTopLawyersFlow = ai.defineFlow(
  {
    name: 'getTopLawyersFlow',
    inputSchema: GetTopLawyersInputSchema,
    outputSchema: GetTopLawyersOutputSchema,
  },
  async ({ lat, lng }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        console.error("GOOGLE_PLACES_API_KEY is not set.");
        // Return empty array instead of throwing to allow Gemini fallback
        return { lawyers: [] };
    }
    
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=lawyer&key=${apiKey}&fields=name,rating,place_id,vicinity`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Google Places API Raw Response:", JSON.stringify(data, null, 2));

        if (!response.ok || !data.results) {
            console.error(`Google Places API request failed with status ${data.status}: ${data.error_message || JSON.stringify(data)}`);
            return { lawyers: [] };
        }

        const lawyers = data.results
            .map((lawyer: any) => ({
                name: lawyer.name,
                rating: lawyer.rating || 0,
                address: lawyer.vicinity || 'Address not available',
                placeId: lawyer.place_id,
            }))
            .sort((a: any, b: any) => b.rating - a.rating)
            .slice(0, 10);
            
        return { lawyers };

    } catch (error) {
        console.error("Failed to fetch from Google Places API:", error);
        return { lawyers: [] };
    }
  }
);
