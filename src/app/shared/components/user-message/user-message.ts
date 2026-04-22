import { Component, computed, input, output } from '@angular/core';

export type MessageType = 'error' | 'warning' | 'info';

@Component({
  selector: 'user-message',
  template: `
    @if (message()) {
      <div class="message-bar" [class]="typeClass()" role="alert" aria-live="assertive">
        <span class="message-icon" aria-hidden="true">{{ icon() }}</span>
        <span class="message-text">{{ message() }}</span>
        <button class="message-close" (click)="closed.emit()" aria-label="Close message">✕</button>
      </div>
    }
  `,
  styles: [`
    .message-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: 0.875rem 1.5rem;
      color: #ffffff;
      font-size: 0.9375rem;
      font-family: inherit;

      &.message-error   { background: #dc2626; }
      &.message-warning { background: #d97706; }
      &.message-info    { background: #2563eb; }
    }

    .message-icon {
      font-size: 1.125rem;
      flex-shrink: 0;
    }

    .message-text {
      flex: 1;
    }

    .message-close {
      flex-shrink: 0;
      background: none;
      border: none;
      color: inherit;
      font-size: 1.125rem;
      line-height: 1;
      cursor: pointer;
      padding: 0.125rem 0.25rem;
      opacity: 0.75;
      transition: opacity 0.15s ease;

      &:hover { opacity: 1; }
      &:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.7);
        border-radius: 2px;
      }
    }
  `]
})
export class UserMessage {
  readonly message = input<string | null>(null);
  readonly type = input<MessageType>('error');
  readonly closed = output();

  protected readonly typeClass = computed(() => `message-${this.type()}`);

  protected readonly icon = computed(() => {
    switch (this.type()) {
      case 'warning': return '⚠';
      case 'info':    return 'ℹ';
      default:        return '✕';
    }
  });
}
