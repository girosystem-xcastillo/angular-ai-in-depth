export type ConversationSummary = {
  id: string;
  title: string;
  createdAt: Date;
};

export type ApiConversationMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ApiConversation = {
  id: string;
  messages: ApiConversationMessage[];
  createdAt: string;
};
