import pino from 'pino';
import { AiMessage } from '../models/ai-message.model.js';

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

export async function getChatCompletion(messages: AiMessage[]) {
  const apiKey = process.env['AI_API_KEY'];
  const apiUrl = process.env['AI_API_URL'] ?? DEFAULT_API_URL;
  const model = process.env['AI_MODEL'] ?? DEFAULT_MODEL;

  if (!apiKey) {
    logger.error('AI_API_KEY environment variable is not set');
    throw new Error('Missing AI_API_KEY environment variable');
  }

  logger.info({ model, apiUrl, messageCount: messages.length }, 'Sending request to AI provider');

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
    logger.error({ status: response.status, body: errorBody }, 'AI provider returned an error response');
    throw new Error(`AI request failed with status ${response.status}: ${errorBody}`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const reply = data.choices[0]?.message?.content;

  if (!reply) {
    logger.error({ responseData: data }, 'AI provider response contained no content');
    throw new Error('AI response did not contain any content');
  }

  logger.info({ replyLength: reply.length }, 'Received reply from AI provider');

  return reply;
}
