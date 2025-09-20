'use server';
/**
 * @fileOverview A Genkit flow to get coordinates for a given city name using the Google Geocoding API.
 *
 * - getCityCoordinates - A function that fetches the coordinates for a city.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
    GetCityCoordinatesInput,
    GetCityCoordinatesInputSchema,
    GetCityCoordinatesOutput,
    GetCityCoordinatesOutputSchema
} from '@/lib/types';


export async function getCityCoordinates(input: GetCityCoordinatesInput): Promise<GetCityCoordinatesOutput> {
  return getCityCoordinatesFlow(input);
}

const getCityCoordinatesFlow = ai.defineFlow(
  {
    name: 'getCityCoordinatesFlow',
    inputSchema: GetCityCoordinatesInputSchema,
    outputSchema: GetCityCoordinatesOutputSchema,
  },
  async ({ cityName }) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.error("GOOGLE_PLACES_API_KEY is not set.");
      throw new Error("Server configuration error: Missing API key.");
    }
    
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Google Geocoding API Raw Response:", JSON.stringify(data, null, 2));

        if (!response.ok || data.status !== 'OK') {
            throw new Error(`Geocoding API request failed with status ${data.status}: ${data.error_message || 'No results found.'}`);
        }
        
        const location = data.results[0]?.geometry?.location;
        if (!location) {
            throw new Error('Could not find coordinates for the specified city.');
        }

        return { lat: location.lat, lng: location.lng };

    } catch (error) {
        console.error("Failed to fetch from Google Geocoding API:", error);
        throw new Error('Failed to retrieve coordinates for the city.');
    }
  }
);
