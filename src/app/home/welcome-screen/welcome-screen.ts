import { Component, signal, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'welcome-screen',
  templateUrl: './welcome-screen.html',
  styleUrl: './welcome-screen.scss',
  imports: [NgOptimizedImage],
})
export class WelcomeScreen {
  inputValue = signal('');
  messageSent = output<string>();

  onInputChange(event: Event) {
    this.inputValue.set((event.target as HTMLInputElement).value);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  send() {
    const content = this.inputValue().trim();
    if (!content) return;
    this.messageSent.emit(content);
    this.inputValue.set('');
  }
}
