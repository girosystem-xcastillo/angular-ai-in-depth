import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Conversation } from './chat.model';
import { ApiConversation, ConversationSummary } from './chat-history.model';

@Injectable({ providedIn: 'root' })
export class ChatHistoryService {
  private readonly http = inject(HttpClient);

  async getAllConversations() {
    const response = await firstValueFrom(
      this.http.get<{ conversations: ConversationSummary[] }>('/api/get-conversations-history')
    );
    return response.conversations;
  }

  async getConversationById(id: string) {
    const response = await firstValueFrom(
      this.http.get<{ conversation: ApiConversation }>(`/api/get-conversation/${id}`)
    );
    return this.mapToConversation(response.conversation);
  }

  private mapToConversation(apiConversation: ApiConversation): Conversation {
    const messages = apiConversation.messages
      .filter(msg => msg.role !== 'system')
      .map((msg, index) => ({
        id: `${apiConversation.id}-${index}`,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(apiConversation.createdAt),
      }));

    const firstUserMessage = messages.find(msg => msg.role === 'user');
    const title = firstUserMessage
      ? firstUserMessage.content.slice(0, 60)
      : 'Untitled conversation';

    return {
      id: apiConversation.id,
      title,
      messages,
      createdAt: new Date(apiConversation.createdAt),
    };
  }
}
