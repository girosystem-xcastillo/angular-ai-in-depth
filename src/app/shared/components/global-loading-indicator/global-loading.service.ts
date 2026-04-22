import { inject, Injectable, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GlobalLoadingService {
  private readonly router = inject(Router);
  private readonly loadingState = signal(false);

  readonly loading = this.loadingState.asReadonly();

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingState.set(true);
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingState.set(false);
      }
    });
  }

  show() {
    this.loadingState.set(true);
  }

  hide() {
    this.loadingState.set(false);
  }
}
