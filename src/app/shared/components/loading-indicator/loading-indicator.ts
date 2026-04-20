import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'loading-indicator',
  imports: [NgOptimizedImage],
  template: `
    <span class="loading-indicator" role="status" aria-label="Loading">
      <img ngSrc="/images/loading-indicator.gif" alt="" width="72" height="72" priority>
    </span>
  `,
  styles: [`
    .loading-indicator {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class LoadingIndicator {}
