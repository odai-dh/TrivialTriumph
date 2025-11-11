'use server';

import {HfInference} from '@huggingface/inference';
import {z} from 'zod';

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

// Initialize Hugging Face client with API key from environment
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function generateJeopardyQuestions(
  input: GenerateJeopardyQuestionsInput
): Promise<GenerateJeopardyQuestionsOutput> {
  const prompt = `Generate 5 Jeopardy! trivia questions for category: ${input.category}

Rules:
- Questions are statements, not questions (Jeopardy! format)
- Values: 100 (easy), 200, 300, 400, 500 (hard)
- Short answers (1-5 words)
- Each tests different knowledge

Example:
Q(100): "This closest star to Earth provides light and heat"
A: "The Sun"

Return ONLY valid JSON array with this exact structure:
[
  {"question": "...", "answer": "...", "value": 100},
  {"question": "...", "answer": "...", "value": 200},
  {"question": "...", "answer": "...", "value": 300},
  {"question": "...", "answer": "...", "value": 400},
  {"question": "...", "answer": "...", "value": 500}
]`;

  try {
    // Use Qwen2.5-72B-Instruct - powerful free model
    const response = await hf.chatCompletion({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content.trim();
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
    }
    
    const output = JSON.parse(jsonStr);
    
    // Validate output
    const validated = GenerateJeopardyQuestionsOutputSchema.parse(output);
    
    // Ensure we have all point values
    const values = validated.map(q => q.value).sort();
    const expected = [100, 200, 300, 400, 500];
    const hasAllValues = expected.every((v, i) => values[i] === v);
    
    if (!hasAllValues) {
      throw new Error('Missing required point values');
    }
    
    return validated.sort((a, b) => a.value - b.value);
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}