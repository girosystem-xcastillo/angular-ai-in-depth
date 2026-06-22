import { ChatMessage } from './chat-message.model.js';

export type Conversation = {
  id: string;
  title: string;
  // Links the conversation to its system prompt without storing the prompt
  // text itself, so the system prompt never reaches the frontend.
  promptId: string;
  messages: ChatMessage[];
  createdAt: Date;
};
