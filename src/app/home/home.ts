import { Component, computed, inject, signal } from '@angular/core';
import { ChatSidebar } from './sidebar/sidebar';
import { WelcomeScreen } from './welcome-screen/welcome-screen';
import { ChatConversation } from './conversation/conversation';
import { ChatMessage, Conversation } from './chat.model';
import { MOCK_CONVERSATIONS } from './mock-conversations';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [ChatSidebar, WelcomeScreen, ChatConversation],
})
export class Home {
  private readonly authService = inject(AuthService);

  sidebarCollapsed = signal(true);
  activeConversationId = signal<string | null>(null);
  conversations = signal<Conversation[]>([...MOCK_CONVERSATIONS]);

  activeConversation = computed(() => {
    const convId = this.activeConversationId();
    if (!convId) return null;
    return this.conversations().find(conv => conv.id === convId) ?? null;
  });

  onCollapseToggled() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  onNewChat() {
    this.activeConversationId.set(null);
  }

  onConversationSelected(convId: string) {
    this.activeConversationId.set(convId);
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

    const currentConvId = this.activeConversationId();
    if (currentConvId) {
      this.conversations.update(convs =>
        convs.map(conv =>
          conv.id === currentConvId
            ? { ...conv, messages: [...conv.messages, newMessage] }
            : conv
        )
      );
    } else {
      const newConversation: Conversation = {
        id: crypto.randomUUID(),
        title: content.length > 50 ? content.slice(0, 47) + '...' : content,
        createdAt: new Date(),
        messages: [newMessage],
      };
      this.conversations.update(convs => [newConversation, ...convs]);
      this.activeConversationId.set(newConversation.id);
      this.sidebarCollapsed.set(false);
    }
  }
}
