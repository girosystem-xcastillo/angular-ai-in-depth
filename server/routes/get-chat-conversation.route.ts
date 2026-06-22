import { Request, Response } from 'express';
import { conversations } from '../db-data.js';
import { Conversation } from '../models/conversation.model.js';

export function getChatConversation(req: Request, res: Response) {
  const conversationId = req.params['id'];

  req.log.info({ conversationId }, 'Fetching conversation');

  const conversation = conversations.find(candidate => candidate.id === conversationId);

  if (!conversation) {
    req.log.warn({ conversationId }, 'Conversation not found');
    res.status(404).json({ message: 'Conversation not found' });
    return;
  }

  const result: Conversation = {
    ...conversation,
    messages: conversation.messages.filter(message => message.role !== 'system'),
  };

  req.log.info({ conversationId, messageCount: result.messages.length }, 'Conversation retrieved');

  res.json(result);
}
