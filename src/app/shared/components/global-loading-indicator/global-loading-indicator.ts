import { Component, inject } from '@angular/core';
import { LoadingIndicator } from '../loading-indicator/loading-indicator';
import { GlobalLoadingService } from './global-loading.service';

@Component({
  selector: 'global-loading-indicator',
  imports: [LoadingIndicator],
  template: `
    @if (globalLoading.loading()) {
      <div class="global-loading-overlay" aria-live="polite" aria-label="Page loading">
        <loading-indicator />
      </div>
    }
  `,
  styles: [`
    .global-loading-overlay {
      position: fixed;
      inset: 0;
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.35);
    }
  `]
})
export class GlobalLoadingIndicator {
  protected readonly globalLoading = inject(GlobalLoadingService);
}
