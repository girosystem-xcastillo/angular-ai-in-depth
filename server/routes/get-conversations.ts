import { Request, Response } from 'express';
import { conversationsDb } from '../conversations-db';

export function getConversations(req: Request, res: Response) {
  const conversations = Array.from(conversationsDb.values());
  res.json({ conversations });
}
