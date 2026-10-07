import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates an answer using the Groq LLM API.
 * 
 * @param systemPrompt - The system instructions (e.g., RAG constraints).
 * @param userPrompt - The user's specific query.
 * @returns The generated string answer.
 */
export async function generateAnswer(systemPrompt: string, userPrompt: string): Promise<string> {
  if (!systemPrompt || !systemPrompt.trim()) {
    throw new Error('System prompt is required to generate an answer.');
  }
  
  if (!userPrompt || !userPrompt.trim()) {
    throw new Error('User prompt is required to generate an answer.');
  }

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.1, // Low temperature for grounded, deterministic RAG answers
      max_tokens: 2000,
    });

    const answer = response.choices[0]?.message?.content;

    if (!answer || answer.trim() === '') {
      throw new Error('LLM returned an empty or invalid response.');
    }

    return answer;
  } catch (error) {
    // Log safe error metric/message without leaking prompts or PII
    console.error('Error generating answer from Groq LLM API:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('Failed to generate answer from the LLM service.');
  }
}
