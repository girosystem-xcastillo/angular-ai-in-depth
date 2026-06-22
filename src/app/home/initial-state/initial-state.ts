import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'initial-state',
  templateUrl: './initial-state.html',
  styleUrl: './initial-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class InitialStateComponent {
  messageSend = output<string>();
  messageText = signal('');

  onInputChange(event: Event) {
    this.messageText.set((event.target as HTMLInputElement).value);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitMessage();
    }
  }

  submitMessage() {
    const text = this.messageText().trim();
    if (!text) return;
    this.messageSend.emit(text);
    this.messageText.set('');
  }
}
