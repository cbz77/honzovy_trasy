'use server';
/**
 * @fileOverview A Genkit flow for suggesting descriptive captions for an array of photos.
 *
 * - suggestPhotoCaptions - A function that handles the photo caption suggestion process.
 * - SuggestPhotoCaptionsInput - The input type for the suggestPhotoCaptions function.
 * - SuggestPhotoCaptionsOutput - The return type for the suggestPhotoCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema for the overall flow
const SuggestPhotoCaptionsInputSchema = z.object({
  photos: z.array(
    z.string().describe(
      "A photo of a route point, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
  ),
});
export type SuggestPhotoCaptionsInput = z.infer<typeof SuggestPhotoCaptionsInputSchema>;

// Output Schema for the overall flow
const SuggestPhotoCaptionsOutputSchema = z.object({
  captions: z.array(z.string().describe("A suggested caption for the photo.")),
});
export type SuggestPhotoCaptionsOutput = z.infer<typeof SuggestPhotoCaptionsOutputSchema>;

// Prompt definition for a single photo
const generatePhotoCaptionPrompt = ai.definePrompt({
  name: 'generatePhotoCaptionPrompt',
  input: {
    schema: z.object({
      photoDataUri: z.string().describe(
        "A photo of a route point, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
    }),
  },
  output: {
    schema: z.string().describe("A suggested caption for the photo."), // Output is a single string caption
  },
  // Use a multi-modal model for image input, overriding the default text-only model if necessary.
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an AI assistant specialized in creating concise and descriptive captions for photographs of outdoor tourist routes.
Generate a short, descriptive caption for the following image. Focus on key visual elements, the general atmosphere, and potential activities.
The caption should be suitable for a photo gallery.
Only return the caption text, do not include any other conversational text.

Image: {{media url=photoDataUri}}`,
});

// Genkit Flow definition
const suggestPhotoCaptionsFlow = ai.defineFlow(
  {
    name: 'suggestPhotoCaptionsFlow',
    inputSchema: SuggestPhotoCaptionsInputSchema,
    outputSchema: SuggestPhotoCaptionsOutputSchema,
  },
  async (input) => {
    const captions: string[] = [];
    for (const photoDataUri of input.photos) {
      // Call the prompt for each photo individually
      const { output } = await generatePhotoCaptionPrompt({ photoDataUri });
      if (output) {
        captions.push(output);
      }
    }
    return { captions };
  }
);

// Exported wrapper function
export async function suggestPhotoCaptions(
  input: SuggestPhotoCaptionsInput
): Promise<SuggestPhotoCaptionsOutput> {
  return suggestPhotoCaptionsFlow(input);
}
