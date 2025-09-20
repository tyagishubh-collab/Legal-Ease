'use server';
/**
 * @fileOverview A Genkit flow to get the approximate location of the user using the Google Geolocation API.
 * This is used as a fallback when browser-based geolocation is unavailable or denied.
 * If the Google API fails, it returns a default location.
 *
 * Deployment Instructions:
 * 1. Set the Google Geolocation API Key in your environment.
 *    For Firebase, use the CLI:
 *    firebase functions:config:set google.geolocation_api_key="YOUR_KEY"
 *    (Or set GOOGLE_GEOLOCATION_API_KEY in your .env file for local development)
 *
 * 2. Deploy your functions/flows.
 *    firebase deploy --only functions
 *
 * Frontend Usage:
 * When navigator.geolocation.getCurrentPosition() fails, call the 'getApproxLocationAction' server action.
 *
 * - getApproxLocation - A function that fetches the approximate location.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { GetApproxLocationOutput, GetApproxLocationOutputSchema } from '@/lib/types';


export async function getApproxLocation(): Promise<GetApproxLocationOutput> {
  return getApproxLocationFlow(null);
}

const getApproxLocationFlow = ai.defineFlow(
  {
    name: 'getApproxLocationFlow',
    inputSchema: z.null(),
    outputSchema: GetApproxLocationOutputSchema,
  },
  async () => {
    // Use the specific Geolocation key first, fallback to the generic Places key.
    const apiKey = process.env.GOOGLE_GEOLOCATION_API_KEY || process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      const errorMsg = "Missing GOOGLE_GEOLOCATION_API_KEY or GOOGLE_PLACES_API_KEY environment variable.";
      console.error(errorMsg);
      // Even if API key is missing, return a default location to prevent frontend failure.
      return { lat: 28.6139, lng: 77.2090 }; // Default to Delhi
    }
    
    const url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ considerIp: true }),
      });
      
      const responseData = await response.json();
      console.log("Google Geolocation API Raw Response:", JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        const errorBody = JSON.stringify(responseData);
        throw new Error(`Google Geolocation API request failed with status ${response.status}: ${errorBody}`);
      }

      if (responseData.location) {
        // Validate the output with Zod before returning.
        const validatedLocation = GetApproxLocationOutputSchema.parse({
            lat: responseData.location.lat,
            lng: responseData.location.lng,
        });
        return validatedLocation;
      } else {
        throw new Error("Geolocation API response did not contain a 'location' object.");
      }
    } catch (error) {
      console.error("Failed to fetch from Google Geolocation API, returning default location:", error);
      // On any failure, return a default location.
      return { lat: 28.6139, lng: 77.2090 }; // Default to Delhi
    }
  }
);
