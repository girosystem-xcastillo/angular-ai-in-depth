import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Conversation } from '../models/conversation.model';
import { ChatHistoryComponent } from '../chat-history/chat-history';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, ChatHistoryComponent],
})
export class SideNavComponent {
  collapsed = input<boolean>(true);
  conversations = input<Conversation[]>([]);
  activeConversationId = input<string | null>(null);

  collapseToggle = output<void>();
  conversationSelect = output<string>();
  newChat = output<void>();
  logout = output<void>();
}
