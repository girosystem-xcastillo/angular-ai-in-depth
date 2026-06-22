import pino from 'pino';
import { AiMessage } from '../models/ai-message.model.js';

// Shape of the AI provider's chat completion response that we rely on.
type ChatCompletionResponse = {
  choices: {
    message: {
      role: string;
      content: string;
    };
  }[];
};

const logger = pino();

const DEFAULT_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_MODEL = 'gpt-4o-mini';

// Sends a list of messages to the AI provider and returns the assistant reply.
// Uses a plain promise-based HTTP request — no provider SDK wrapper.
export async function getChatCompletion(messages: AiMessage[]) {
  const apiKey = process.env['AI_API_KEY'];
  const apiUrl = process.env['AI_API_URL'] ?? DEFAULT_API_URL;
  const model = process.env['AI_MODEL'] ?? DEFAULT_MODEL;

  if (!apiKey) {
    throw new Error('Missing AI_API_KEY environment variable');
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error({ status: response.status, body: errorBody }, 'AI API request failed');
    throw new Error(`AI request failed with status ${response.status}: ${errorBody}`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const reply = data.choices[0]?.message?.content;

  if (!reply) {
    throw new Error('AI response did not contain any content');
  }

  return reply;
}
