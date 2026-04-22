import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLoadingIndicator } from './shared/components/router-loading-indicator/router-loading-indicator';
import { UserMessage } from './shared/components/user-message/user-message';
import { UserMessageService } from './shared/components/user-message/user-message.service';

@Component({
  selector: 'root',
  imports: [RouterOutlet, RouterLoadingIndicator, UserMessage],
  template: `
    <user-message
      [message]="userMessageService.message()"
      [type]="userMessageService.type()"
      (closed)="userMessageService.clear()" />
    <router-loading-indicator />
    <router-outlet />
  `
})
export class App {
  protected readonly userMessageService = inject(UserMessageService);
}
