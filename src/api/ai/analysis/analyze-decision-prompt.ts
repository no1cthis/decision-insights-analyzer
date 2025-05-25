import { z } from 'zod';
import type { LLMMessage } from '../openrouter-client';
import { openRouterClient } from '../openrouter-client';

export interface AnalyzeDecisionInput {
  description: string;
  decision: string;
  reasons?: string;
}

const AnalyzeDecisionResponseSchema = z.object({
  category: z.string(),
  cognitiveDistortions: z.array(z.string()),
  missedAlternatives: z.array(z.string()),
  explanation: z.string(),
});

export type AnalyzeDecisionResponse = z.infer<typeof AnalyzeDecisionResponseSchema>;

function generateLlmMessages({ description, decision, reasons }: AnalyzeDecisionInput): LLMMessage[] {
    const prompt = `Analyze the following situation and decision:

Situation Description:
${description}

Decision Made:
${decision}

${reasons ? `User's Reasons:
${reasons}
` : ''}`;

const systemMessage = `You are an expert in cognitive psychology and decision analysis. Always output your response in the following JSON format without any other text:
{
  "category": <string, the category of the decision, e.g., emotional, strategic, impulsive, etc.>,
  "cognitiveDistortions": <array of strings, potential cognitive distortions that may have influenced the decision>,
  "missedAlternatives": <array of strings, missed alternatives or paths that were not considered>
  "explanation": <string, explanation of the decision and the analysis>
}`
  return [
    { role: 'system', content: systemMessage },
    { role: 'user', content: prompt },
  ];
}

export async function analyzeDecisionWithLLM(input: AnalyzeDecisionInput): Promise<AnalyzeDecisionResponse> {
  const response = await openRouterClient.callLLM({ messages: generateLlmMessages(input) });
  const content = response.choices?.[0]?.message?.content;
  if (!content) throw new Error('No content returned from LLM');
  // Try to parse JSON from the response
  try {
    const parsed:AnalyzeDecisionResponse = JSON.parse(content);
    return AnalyzeDecisionResponseSchema.parse(parsed);
  } catch (e) {
    throw new Error('Failed to parse or validate LLM response as JSON: ' + e + '\nRaw content: ' + content);
  }
} 