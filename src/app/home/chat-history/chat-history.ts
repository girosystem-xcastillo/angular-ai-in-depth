import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Conversation } from '../models/conversation.model';

@Component({
  selector: 'chat-history',
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatHistoryComponent {
  conversations = input<Conversation[]>([]);
  activeConversationId = input<string | null>(null);
  conversationSelect = output<string>();

  selectConversation(id: string) {
    this.conversationSelect.emit(id);
  }
}
