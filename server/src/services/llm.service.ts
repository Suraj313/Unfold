import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Generates an answer using the Groq LLM API.
 * 
 * @param systemPrompt - The system instructions (e.g., RAG constraints).
 * @param userPrompt - The user's specific query.
 * @param jsonMode - Whether to request JSON object format from the LLM.
 * @returns The generated string answer.
 */
export async function generateAnswer(systemPrompt: string, userPrompt: string, jsonMode: boolean = false): Promise<string> {
  if (!systemPrompt || !systemPrompt.trim()) {
    throw new Error('System prompt is required to generate an answer.');
  }
  
  if (!userPrompt || !userPrompt.trim()) {
    throw new Error('User prompt is required to generate an answer.');
  }

  const maxAttempts = 3;
  const backoffDelays = [1000, 2000]; // Delays in ms for attempt 2 and 3

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
        response_format: jsonMode ? { type: 'json_object' } : undefined,
      });

      const answer = response.choices[0]?.message?.content;

      if (!answer || answer.trim() === '') {
        throw new Error('LLM returned an empty or invalid response.');
      }

      return answer;
    } catch (error: any) {
      const status = error.status || error.response?.status;
      
      const isTransient = 
        !status || // Network/timeout error
        status === 429 || // Rate limit
        status >= 500; // Server error

      if (!isTransient || attempt === maxAttempts) {
        // Log safe error metric/message without leaking prompts or PII
        console.error(`Error generating answer from Groq LLM API (Attempt ${attempt}/${maxAttempts}):`, error instanceof Error ? error.message : 'Unknown error');
        throw new Error('Failed to generate answer from the LLM service.');
      }

      const delay = backoffDelays[attempt - 1];
      console.warn(`Transient error from Groq LLM API. Retrying attempt ${attempt + 1}/${maxAttempts} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Failed to generate answer from the LLM service.');
}
