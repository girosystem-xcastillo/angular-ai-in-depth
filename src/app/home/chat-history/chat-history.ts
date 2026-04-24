import { Component, input, output } from '@angular/core';
import { ConversationSummary } from '../chat-history.model';

@Component({
  selector: 'chat-history',
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory {
  conversations = input.required<ConversationSummary[]>();
  activeConversationId = input<string | null>(null);
  conversationSelected = output<string>();

  selectConversation(conversationId: string) {
    this.conversationSelected.emit(conversationId);
  }
}
