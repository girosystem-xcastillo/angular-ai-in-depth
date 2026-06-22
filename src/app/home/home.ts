import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { Conversation } from './models/conversation.model';
import { MOCK_CONVERSATIONS, MOCK_REPLIES } from './mock-data';
import { SideNavComponent } from './side-nav/side-nav';
import { InitialStateComponent } from './initial-state/initial-state';
import { ConversationThreadComponent } from './conversation-thread/conversation-thread';

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SideNavComponent, InitialStateComponent, ConversationThreadComponent],
})
export class HomeComponent {
  conversations = signal<Conversation[]>([...MOCK_CONVERSATIONS]);
  activeConversationId = signal<string | null>(null);
  sidebarCollapsed = signal(true);
  isLoading = signal(false);

  activeConversation = computed(() => {
    const activeId = this.activeConversationId();
    if (!activeId) return null;
    return this.conversations().find(conv => conv.id === activeId) ?? null;
  });

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  selectConversation(id: string) {
    this.activeConversationId.set(id);
    this.sidebarCollapsed.set(this.isMobileViewport());
  }

  startNewChat() {
    this.activeConversationId.set(null);
    this.sidebarCollapsed.set(true);
  }

  async handleNewMessage(text: string) {
    const conversationId = crypto.randomUUID();

    const newConversation: Conversation = {
      id: conversationId,
      title: text.length > 60 ? text.substring(0, 60) + '...' : text,
      messages: [{ id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date() }],
      createdAt: new Date(),
    };

    this.conversations.update(convos => [newConversation, ...convos]);
    this.activeConversationId.set(conversationId);
    this.sidebarCollapsed.set(this.isMobileViewport());
    this.isLoading.set(true);

    await new Promise<void>(resolve => setTimeout(resolve, 3000));

    this.conversations.update(convos =>
      convos.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                { id: crypto.randomUUID(), role: 'assistant', content: this.pickMockReply(), timestamp: new Date() },
              ],
            }
          : conv
      )
    );
    this.isLoading.set(false);
  }

  async handleConversationMessage(text: string) {
    const activeId = this.activeConversationId();
    if (!activeId) return;

    this.conversations.update(convos =>
      convos.map(conv =>
        conv.id === activeId
          ? { ...conv, messages: [...conv.messages, { id: crypto.randomUUID(), role: 'user', content: text, timestamp: new Date() }] }
          : conv
      )
    );
    this.isLoading.set(true);

    await new Promise<void>(resolve => setTimeout(resolve, 3000));

    this.conversations.update(convos =>
      convos.map(conv =>
        conv.id === activeId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                { id: crypto.randomUUID(), role: 'assistant', content: this.pickMockReply(), timestamp: new Date() },
              ],
            }
          : conv
      )
    );
    this.isLoading.set(false);
  }

  handleLogout() {
    this.startNewChat();
  }

  private isMobileViewport(): boolean {
    return window.innerWidth <= 768;
  }

  private pickMockReply(): string {
    return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
  }
}
