import { MessageRole } from './message-role.model.js';

// A single message in the format expected by the AI provider's chat API.
export type AiMessage = {
  role: MessageRole;
  content: string;
};
