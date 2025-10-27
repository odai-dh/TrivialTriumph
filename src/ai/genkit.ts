import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
  logLevel: 'error', // Change from 'debug' to 'error' to reduce console spam
  model: 'googleai/gemini-2.0-flash-exp', // Free tier, fast, efficient
});