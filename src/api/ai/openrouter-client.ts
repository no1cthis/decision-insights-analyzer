import { OPENROUTER_API_KEY, OPENROUTER_API_URL, OPENROUTER_DEFAULT_MODEL } from './constants';

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  max_tokens?: number;
  temperature?: number;
}

export interface LLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: LLMMessage;
    finish_reason: string;
  }>;
}

export function createOpenRouterClient(model: string = OPENROUTER_DEFAULT_MODEL ) {
    if(!OPENROUTER_API_KEY) {
        throw new Error(`apiKey is not set`);
    }
    return { 
        callLLM: async (request: LLMRequest, retries = 2): Promise<LLMResponse>  => {
        for (let attempt = 0; attempt <= retries; attempt++) {
          try {
            const res = await fetch(OPENROUTER_API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
              },
              body: JSON.stringify({
                model: model,
                messages: request.messages,
                max_tokens: request.max_tokens,
                temperature: request.temperature,
              }),
            });
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(`OpenRouter API error: ${res.status} ${res.statusText} - ${errorText}`);
            }
            return await res.json();
          } catch (err) {
            if (attempt === retries) throw err;
            await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
          }
        }
        throw new Error('Failed to call OpenRouter LLM after retries');
      } 
    };
}

export const openRouterClient = createOpenRouterClient(); 