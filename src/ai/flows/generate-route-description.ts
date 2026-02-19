'use server';
/**
 * @fileOverview An AI agent that generates detailed and engaging descriptions for route points.
 *
 * - generateRouteDescription - A function that handles the route description generation process.
 * - GenerateRouteDescriptionInput - The input type for the generateRouteDescription function.
 * - GenerateRouteDescriptionOutput - The return type for the generateRouteDescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateRouteDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the route point.'),
  latitude: z.number().describe('The latitude coordinate of the route point.'),
  longitude: z.number().describe('The longitude coordinate of the route point.'),
});
export type GenerateRouteDescriptionInput = z.infer<typeof GenerateRouteDescriptionInputSchema>;

const GenerateRouteDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and engaging description for the route point.'),
});
export type GenerateRouteDescriptionOutput = z.infer<typeof GenerateRouteDescriptionOutputSchema>;

export async function generateRouteDescription(input: GenerateRouteDescriptionInput): Promise<GenerateRouteDescriptionOutput> {
  return generateRouteDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRouteDescriptionPrompt',
  input: { schema: GenerateRouteDescriptionInputSchema },
  output: { schema: GenerateRouteDescriptionOutputSchema },
  prompt: `You are an expert travel guide and storyteller specializing in creating captivating descriptions for tourist routes.

Based on the following route point details, create a detailed and engaging description for a hiking or tourist route. The description should be evocative, highlight its unique features, potential scenic sights, the overall experience for visitors, and any relevant historical or natural context you can infer or imagine.

Route Point Name: {{{name}}}
GPS Coordinates: {{{latitude}}}, {{{longitude}}}

Focus on creating a compelling narrative that would entice visitors. The description should be approximately 3-5 paragraphs long and rich in detail.`,
});

const generateRouteDescriptionFlow = ai.defineFlow(
  {
    name: 'generateRouteDescriptionFlow',
    inputSchema: GenerateRouteDescriptionInputSchema,
    outputSchema: GenerateRouteDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
