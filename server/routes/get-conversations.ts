import { Request, Response } from 'express';
import { conversationsDb } from '../conversations-db';
import { ConversationSummary } from './get-conversations.model';

export function getConversations(req: Request, res: Response) {
  const conversations: ConversationSummary[] = Array.from(conversationsDb.values()).map(conv => {
    const firstUserMessage = conv.messages.find(msg => msg.role === 'user');
    const title = firstUserMessage
      ? firstUserMessage.content.slice(0, 60)
      : 'Untitled conversation';

    return { id: conv.id, title, createdAt: conv.createdAt };
  });

  res.json({ conversations });
}
