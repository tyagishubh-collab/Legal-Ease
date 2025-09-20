'use server';
/**
 * @fileOverview A Genkit flow to get the approximate location of the user using the Google Geolocation API.
 * This is used as a fallback when browser-based geolocation is unavailable or denied.
 *
 * - getApproxLocation - A function that fetches the approximate location.
 * - GetApproxLocationOutput - The return type for the getApproxLocation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GetApproxLocationOutput, GetApproxLocationOutputSchema } from '@/lib/types';


export async function getApproxLocation(): Promise<GetApproxLocationOutput> {
  return getApproxLocationFlow();
}

const getApproxLocationFlow = ai.defineFlow(
  {
    name: 'getApproxLocationFlow',
    inputSchema: z.null(),
    outputSchema: GetApproxLocationOutputSchema,
  },
  async () => {
    const apiKey = process.env.GOOGLE_GEOLOCATION_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_GEOLOCATION_API_KEY or GOOGLE_PLACES_API_KEY is not set.");
      throw new Error("Server configuration error: API key is missing.");
    }
    
    const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Google Geolocation API request failed with status ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      
      if (data.location) {
        return {
          lat: data.location.lat,
          lng: data.location.lng,
        };
      } else {
        throw new Error("Failed to determine location from Geolocation API response.");
      }
    } catch (error) {
      console.error("Failed to fetch from Google Geolocation API:", error);
      throw new Error("Could not determine approximate location.");
    }
  }
);
