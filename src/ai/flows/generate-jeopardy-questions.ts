'use server';

/**
 * @fileOverview A flow that generates Jeopardy-style questions for a given category.
 *
 * - generateJeopardyQuestions - A function that generates Jeopardy-style questions for a given category.
 * - GenerateJeopardyQuestionsInput - The input type for the generateJeopardyQuestions function.
 * - GenerateJeopardyQuestionsOutput - The return type for the generateJeopardyQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJeopardyQuestionsInputSchema = z.object({
  category: z.string().describe('The category for which to generate questions.'),
});
export type GenerateJeopardyQuestionsInput = z.infer<typeof GenerateJeopardyQuestionsInputSchema>;

const GenerateJeopardyQuestionsOutputSchema = z.array(
  z.object({
    question: z.string().describe('The Jeopardy-style question.'),
    answer: z.string().describe('The answer to the question.'),
    value: z.number().describe('The point value of the question (100-500).'),
  })
);
export type GenerateJeopardyQuestionsOutput = z.infer<typeof GenerateJeopardyQuestionsOutputSchema>;

export async function generateJeopardyQuestions(
  input: GenerateJeopardyQuestionsInput
): Promise<GenerateJeopardyQuestionsOutput> {
  return generateJeopardyQuestionsFlow(input);
}

const generateJeopardyQuestionsPrompt = ai.definePrompt({
  name: 'generateJeopardyQuestionsPrompt',
  input: {schema: GenerateJeopardyQuestionsInputSchema},
  output: {schema: GenerateJeopardyQuestionsOutputSchema},
  prompt: `Generate 5 trivia questions with answers for the category '{{category}}'. The questions should be in a style similar to the game show Jeopardy!, but easy enough for a casual party game. Include difficulty levels increasing from 100 to 500 points.`,
});

const generateJeopardyQuestionsFlow = ai.defineFlow(
  {
    name: 'generateJeopardyQuestionsFlow',
    inputSchema: GenerateJeopardyQuestionsInputSchema,
    outputSchema: GenerateJeopardyQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateJeopardyQuestionsPrompt(input);
    return output!;
  }
);
