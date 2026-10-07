const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const EMBEDDING_DIMENSIONS = 768;

async function generateOllamaEmbedding(text: string): Promise<number[]> {
  const EMBEDDING_MODEL = 'nomic-embed-text';
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        input: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Ollama embedding request failed: ${response.status} ${errorText}`);
      throw new Error('Ollama embedding request failed');
    }

    const data = (await response.json()) as {
      embeddings?: number[][];
    };

    const embedding = data.embeddings?.[0];

    if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Invalid embedding dimension. Expected ${EMBEDDING_DIMENSIONS}, got ${embedding?.length}`,
      );
    }

    return embedding;
  } catch (error) {
    console.error('Error generating Ollama embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

async function generateJinaEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.JINA_API_KEY;
  const model = process.env.JINA_EMBEDDING_MODEL || 'jina-embeddings-v5-text-nano';
  
  if (!apiKey) {
    throw new Error('JINA_API_KEY is required for Jina embeddings');
  }

  try {
    const response = await fetch('https://api.jina.ai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        input: [text]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jina embedding request failed: ${response.status} ${errorText}`);
      throw new Error('Jina embedding request failed');
    }

    const data = await response.json();
    const embedding = data.data?.[0]?.embedding;

    if (!embedding || embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Invalid embedding dimension from Jina. Expected ${EMBEDDING_DIMENSIONS}, got ${embedding?.length}`
      );
    }

    return embedding;
  } catch (error) {
    console.error('Error generating Jina embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('Text is required to generate an embedding');
  }

  const provider = (process.env.EMBEDDING_PROVIDER || 'ollama').toLowerCase();

  if (provider === 'jina') {
    return generateJinaEmbedding(text);
  } else if (provider === 'ollama') {
    return generateOllamaEmbedding(text);
  } else {
    throw new Error(`Unsupported embedding provider: ${provider}`);
  }
}