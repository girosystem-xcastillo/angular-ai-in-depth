import { Component, input, output } from '@angular/core';
import { Conversation } from '../chat.model';

@Component({
  selector: 'chat-history',
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory {
  conversations = input.required<Conversation[]>();
  activeConversationId = input<string | null>(null);
  conversationSelected = output<string>();

  selectConversation(conversationId: string) {
    this.conversationSelected.emit(conversationId);
  }
}
