import { Request, Response } from 'express';
import { conversations } from '../db-data.js';
import { ConversationSummary } from '../models/conversation-summary.model.js';

export function getChatHistory(req: Request, res: Response) {
  const history: ConversationSummary[] = conversations.map(conversation => ({
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
  }));

  req.log.info(`Retrieved ${history.length} conversation summaries`);

  res.json(history);
}
