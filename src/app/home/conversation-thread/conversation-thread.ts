import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Conversation } from '../models/conversation.model';

@Component({
  selector: 'conversation-thread',
  templateUrl: './conversation-thread.html',
  styleUrl: './conversation-thread.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class ConversationThreadComponent implements AfterViewChecked {
  conversation = input.required<Conversation>();
  isLoading = input<boolean>(false);
  messageSend = output<string>();

  messageText = signal('');
  countdown = signal(10);

  private messagesEnd = viewChild<ElementRef<HTMLElement>>('messagesEnd');
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const loading = this.isLoading();
      untracked(() => {
        this.stopCountdown();
        if (loading) {
          this.countdown.set(10);
          this.countdownInterval = setInterval(() => {
            this.countdown.update(n => Math.max(0, n - 1));
          }, 1000);
        }
      });
    });

    this.destroyRef.onDestroy(() => this.stopCountdown());
  }

  ngAfterViewChecked() {
    this.messagesEnd()?.nativeElement.scrollIntoView({ behavior: 'instant' });
  }

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

  private stopCountdown() {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
}
