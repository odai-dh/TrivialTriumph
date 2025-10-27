'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJeopardyQuestionsInputSchema = z.object({
  category: z.string().describe('The category for which to generate questions.'),
});
export type GenerateJeopardyQuestionsInput = z.infer<typeof GenerateJeopardyQuestionsInputSchema>;

const GenerateJeopardyQuestionsOutputSchema = z.array(
  z.object({
    question: z.string().min(10).describe('The Jeopardy-style question.'),
    answer: z.string().min(1).max(100).describe('The answer to the question.'),
    value: z.number().int().min(100).max(500).describe('The point value of the question (100-500).'),
  })
).length(5);
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
  // Shorter, more direct prompt to save tokens
  prompt: `Generate 5 Jeopardy! trivia questions for category: {{category}}

Rules:
- Questions are statements, not questions (Jeopardy! format)
- Values: 100 (easy), 200, 300, 400, 500 (hard)
- Short answers (1-5 words)
- Each tests different knowledge

Example:
Q(100): "This closest star to Earth provides light and heat"
A: "The Sun"`,
});

const generateJeopardyQuestionsFlow = ai.defineFlow(
  {
    name: 'generateJeopardyQuestionsFlow',
    inputSchema: GenerateJeopardyQuestionsInputSchema,
    outputSchema: GenerateJeopardyQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateJeopardyQuestionsPrompt(input);
    
    if (!output || output.length !== 5) {
      throw new Error('Invalid output from AI');
    }
    
    // Simple validation: ensure we have all point values
    const values = output.map(q => q.value).sort();
    const expected = [100, 200, 300, 400, 500];
    const hasAllValues = expected.every((v, i) => values[i] === v);
    
    if (!hasAllValues) {
      throw new Error('Missing required point values');
    }
    
    return output.sort((a, b) => a.value - b.value);
  }
);