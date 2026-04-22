import { Injectable, signal } from '@angular/core';
import { MessageType } from './user-message';

@Injectable({ providedIn: 'root' })
export class UserMessageService {
  readonly message = signal<string | null>(null);
  readonly type = signal<MessageType>('error');

  show(message: string, type: MessageType = 'error') {
    this.type.set(type);
    this.message.set(message);
  }

  clear() {
    this.message.set(null);
  }
}
