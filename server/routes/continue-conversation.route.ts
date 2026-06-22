import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { conversations } from '../db-data.js';
import { getPromptById } from '../prompts.js';
import { getChatCompletion } from '../ai/ai-client.js';
import { AiMessage } from '../models/ai-message.model.js';
import { ChatMessage } from '../models/chat-message.model.js';

export async function continueConversation(req: Request, res: Response) {
  const conversationId = req.body?.conversationId;
  const message = req.body?.message;

  req.log.info({ conversationId }, 'Continuing conversation');

  if (typeof conversationId !== 'string' || typeof message !== 'string' || !message.trim()) {
    req.log.warn(
      { conversationId, hasMessage: Boolean(message) },
      'Invalid request body for continue-conversation',
    );
    res.status(400).json({ message: 'conversationId and a non-empty message are required' });
    return;
  }

  const conversation = conversations.find(candidate => candidate.id === conversationId);

  if (!conversation) {
    req.log.warn({ conversationId }, 'Conversation not found');
    res.status(404).json({ message: 'Conversation not found' });
    return;
  }

  const prompt = getPromptById(conversation.promptId);

  if (!prompt) {
    req.log.error(
      { conversationId, promptId: conversation.promptId },
      'Conversation references a prompt that no longer exists',
    );
    res.status(500).json({ message: 'Conversation is linked to an unknown prompt' });
    return;
  }

  const userMessage: ChatMessage = {
    id: randomUUID(),
    role: 'user',
    content: message,
    timestamp: new Date(),
  };

  // Build the AI request: the system prompt first (never persisted), then the
  // full conversation history including the message we just received.
  const aiMessages: AiMessage[] = [
    { role: 'system', content: prompt.systemPrompt },
    ...conversation.messages.map(stored => ({ role: stored.role, content: stored.content })),
    { role: userMessage.role, content: userMessage.content },
  ];

  req.log.info(
    { conversationId, promptId: conversation.promptId, messageCount: aiMessages.length },
    'Sending conversation to AI provider',
  );

  let reply: string;

  try {
    reply = await getChatCompletion(aiMessages);
  } catch (error) {
    req.log.error({ err: error, conversationId }, 'AI request failed while continuing a conversation');
    res.status(502).json({ message: 'Failed to get a response from the AI provider' });
    return;
  }

  const assistantMessage: ChatMessage = {
    id: randomUUID(),
    role: 'assistant',
    content: reply,
    timestamp: new Date(),
  };

  // Persist only after the AI reply succeeds, so a failed call does not leave
  // a dangling user message in the stored conversation.
  conversation.messages.push(userMessage, assistantMessage);

  req.log.info(
    { conversationId, totalMessages: conversation.messages.length },
    'Conversation continued and saved',
  );

  res.json({ conversationId, reply });
}
