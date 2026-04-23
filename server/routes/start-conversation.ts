import { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../logger';
import { getSystemPrompt } from '../prompts';
import { conversationsDb, AiMessage } from '../conversations-db';
import { getAiCompletion } from '../utils/ai';

export async function startConversation(req: Request, res: Response) {
  const { promptId, message } = req.body ?? {};

  if (!promptId || typeof promptId !== 'string') {
    logger.warn({ body: req.body }, 'start-conversation: missing promptId');
    res.status(400).json({ message: 'promptId is required.' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    logger.warn({ promptId }, 'start-conversation: missing or empty message');
    res.status(400).json({ message: 'message is required.' });
    return;
  }

  const systemPrompt = getSystemPrompt(promptId);

  if (!systemPrompt) {
    logger.warn({ promptId }, 'start-conversation: unknown promptId');
    res.status(400).json({ message: 'Unknown promptId.' });
    return;
  }

  const messages: AiMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: message.trim() },
  ];

  logger.info({ promptId }, 'Requesting AI completion for new conversation');

  let assistantContent: string;

  try {
    assistantContent = await getAiCompletion(messages);
  } catch (err) {
    logger.error({ err, promptId }, 'Failed to get AI completion');
    res.status(502).json({ message: 'Could not reach AI service. Please try again.' });
    return;
  }

  const conversationId = randomUUID();

  conversationsDb.set(conversationId, {
    id: conversationId,
    messages: [
      ...messages,
      { role: 'assistant', content: assistantContent },
    ],
    createdAt: new Date(),
  });

  logger.info({ conversationId, promptId }, 'Conversation started and saved');

  res.status(201).json({ conversationId, message: assistantContent });
}
