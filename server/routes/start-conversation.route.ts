import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { conversations } from '../db-data.js';
import { getPromptById } from '../prompts.js';
import { getChatCompletion } from '../ai/ai-client.js';
import { Conversation } from '../models/conversation.model.js';
import { ChatMessage } from '../models/chat-message.model.js';

export async function startConversation(req: Request, res: Response) {
  const promptId = req.body?.promptId;
  const message = req.body?.message;

  req.log.info({ promptId }, 'Starting new conversation');

  if (typeof promptId !== 'string' || typeof message !== 'string' || !message.trim()) {
    req.log.warn({ promptId, hasMessage: Boolean(message) }, 'Invalid request body for start-conversation');
    res.status(400).json({ message: 'promptId and a non-empty message are required' });
    return;
  }

  const prompt = getPromptById(promptId);

  if (!prompt) {
    req.log.warn({ promptId }, 'Prompt not found');
    res.status(404).json({ message: 'Prompt not found' });
    return;
  }

  const now = new Date();

  const userMessage: ChatMessage = {
    id: randomUUID(),
    role: 'user',
    content: message,
    timestamp: now,
  };

  let reply: string;

  try {
    // The system prompt is sent to the AI only — it is never persisted on the
    // conversation, so it cannot leak to the frontend.
    reply = await getChatCompletion([
      { role: 'system', content: prompt.systemPrompt },
      { role: 'user', content: message },
    ]);
  } catch (error) {
    req.log.error({ err: error }, 'AI request failed while starting a conversation');
    res.status(502).json({ message: 'Failed to get a response from the AI provider' });
    return;
  }

  const assistantMessage: ChatMessage = {
    id: randomUUID(),
    role: 'assistant',
    content: reply,
    timestamp: new Date(),
  };

  const conversation: Conversation = {
    id: randomUUID(),
    title: message.length > 60 ? `${message.substring(0, 60)}...` : message,
    promptId,
    messages: [userMessage, assistantMessage],
    createdAt: now,
  };

  conversations.unshift(conversation);

  req.log.info({ conversationId: conversation.id, promptId }, 'Conversation started and saved');

  res.json({ conversationId: conversation.id, reply });
}
