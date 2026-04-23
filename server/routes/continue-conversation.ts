import { Request, Response } from 'express';
import { logger } from '../logger';
import { conversationsDb } from '../conversations-db';
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

  const updatedMessages = [
    ...conversation.messages,
    { role: 'user' as const, content: message.trim() },
  ];

  logger.info({ conversationId, messageCount: updatedMessages.length }, 'Requesting AI completion to continue conversation');

  let assistantContent: string;

  try {
    assistantContent = await getAiCompletion(updatedMessages);
  } catch (err) {
    logger.error({ err, conversationId }, 'Failed to get AI completion');
    res.status(502).json({ message: 'Could not reach AI service. Please try again.' });
    return;
  }

  conversationsDb.set(conversationId, {
    ...conversation,
    messages: [
      ...updatedMessages,
      { role: 'assistant', content: assistantContent },
    ],
  });

  logger.info({ conversationId }, 'Conversation continued and saved');

  res.json({ message: assistantContent });
}
