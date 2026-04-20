import { Component, inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, filter, startWith } from 'rxjs';
import { LoadingIndicator } from '../loading-indicator/loading-indicator';

@Component({
  selector: 'router-loading-indicator',
  imports: [LoadingIndicator],
  template: `
    @if (loading()) {
      <div class="router-loading-overlay" aria-live="polite" aria-label="Page loading">
        <loading-indicator />
      </div>
    }
  `,
  styles: [`
    .router-loading-overlay {
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
export class RouterLoadingIndicator {
  private readonly router = inject(Router);

  protected readonly loading = toSignal(
    this.router.events.pipe(
      filter(e =>
        e instanceof NavigationStart ||
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      ),
      map(e => e instanceof NavigationStart),
      startWith(false)
    ),
    { initialValue: false }
  );
}
