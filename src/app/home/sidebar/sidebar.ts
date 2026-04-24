import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ChatHistory } from '../chat-history/chat-history';
import { ConversationSummary } from '../chat-history.model';

@Component({
  selector: 'chat-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [NgOptimizedImage, ChatHistory],
})
export class ChatSidebar {
  collapsed = input.required<boolean>();
  conversations = input.required<ConversationSummary[]>();
  activeConversationId = input<string | null>(null);

  collapseToggled = output<void>();
  newChatClicked = output<void>();
  conversationSelected = output<string>();
  logoutClicked = output<void>();

  toggleCollapse() {
    this.collapseToggled.emit();
  }

  newChat() {
    this.newChatClicked.emit();
  }

  onConversationSelected(convId: string) {
    this.conversationSelected.emit(convId);
  }

  logout() {
    this.logoutClicked.emit();
  }
}
