import { Request, Response } from 'express';
import { logger } from '../logger';
import { conversationsDb } from '../conversations-db';

export function getConversation(req: Request, res: Response) {
  const { id } = req.params;

  const conversation = conversationsDb.get(id);

  if (!conversation) {
    logger.warn({ id }, 'get-conversation: conversation not found');
    res.status(404).json({ message: 'Conversation not found.' });
    return;
  }

  logger.info({ id, messageCount: conversation.messages.length }, 'Returning conversation');

  res.json({ conversation });
}
