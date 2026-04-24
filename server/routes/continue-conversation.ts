import { Request, Response } from 'express';
import { logger } from '../logger';
import { conversationsDb, AiMessage } from '../conversations-db';
import { getSystemPrompt } from '../prompts';
import { getAiCompletion } from '../utils/ai';

export async function continueConversation(req: Request, res: Response) {
  const { conversationId, message } = req.body ?? {};

  if (!conversationId || typeof conversationId !== 'string') {
    logger.warn({ body: req.body }, 'continue-conversation: missing conversationId');
    res.status(400).json({ message: 'conversationId is required.' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    logger.warn({ conversationId }, 'continue-conversation: missing or empty message');
    res.status(400).json({ message: 'message is required.' });
    return;
  }

  const conversation = conversationsDb.get(conversationId);

  if (!conversation) {
    logger.warn({ conversationId }, 'continue-conversation: conversation not found');
    res.status(404).json({ message: 'Conversation not found.' });
    return;
  }

  const systemPrompt = getSystemPrompt(conversation.promptId);

  if (!systemPrompt) {
    logger.error({ conversationId, promptId: conversation.promptId }, 'continue-conversation: prompt no longer available');
    res.status(500).json({ message: 'Conversation prompt is no longer available.' });
    return;
  }

  const userMessage = message.trim();

  const messagesForAi: AiMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversation.messages,
    { role: 'user', content: userMessage },
  ];

  logger.info({ conversationId, messageCount: messagesForAi.length }, 'Requesting AI completion to continue conversation');

  let assistantContent: string;

  try {
    assistantContent = await getAiCompletion(messagesForAi);
  } catch (err) {
    logger.error({ err, conversationId }, 'Failed to get AI completion');
    res.status(502).json({ message: 'Could not reach AI service. Please try again.' });
    return;
  }

  conversationsDb.set(conversationId, {
    ...conversation,
    messages: [
      ...conversation.messages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: assistantContent },
    ],
  });

  logger.info({ conversationId }, 'Conversation continued and saved');

  res.json({ message: assistantContent });
}
