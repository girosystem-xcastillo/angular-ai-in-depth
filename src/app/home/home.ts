import { Component, inject, OnInit, signal } from '@angular/core';
import { ChatSidebar } from './sidebar/sidebar';
import { WelcomeScreen } from './welcome-screen/welcome-screen';
import { ChatConversation } from './conversation/conversation';
import { ChatMessage, Conversation } from './chat.model';
import { ConversationSummary } from './chat-history.model';
import { ChatHistoryService } from './chat-history.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [ChatSidebar, WelcomeScreen, ChatConversation],
})
export class Home implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly chatHistoryService = inject(ChatHistoryService);

  sidebarCollapsed = signal(true);
  conversationSummaries = signal<ConversationSummary[]>([]);
  activeConversation = signal<Conversation | null>(null);

  async ngOnInit() {
    try {
      const summaries = await this.chatHistoryService.getAllConversations();
      this.conversationSummaries.set(summaries);
    } catch {
      // Leave sidebar empty on error
    }
  }

  onCollapseToggled() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onNewChat() {
    this.activeConversation.set(null);
  }

  async onConversationSelected(convId: string) {
    try {
      const conversation = await this.chatHistoryService.getConversationById(convId);
      this.activeConversation.set(conversation);
    } catch {
      // Keep current view on error
    }
  }

  async onLogout() {
    await this.authService.logout();
  }

  onMessageSent(content: string) {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const current = this.activeConversation();
    if (current) {
      this.activeConversation.set({
        ...current,
        messages: [...current.messages, newMessage],
      });
    } else {
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        title: content.length > 50 ? content.slice(0, 47) + '...' : content,
        createdAt: new Date(),
        messages: [newMessage],
      };
      const summary: ConversationSummary = {
        id: newConversation.id,
        title: newConversation.title,
        createdAt: newConversation.createdAt,
      };
      this.conversationSummaries.update(summaries => [summary, ...summaries]);
      this.activeConversation.set(newConversation);
      this.sidebarCollapsed.set(false);
    }
  }
}
