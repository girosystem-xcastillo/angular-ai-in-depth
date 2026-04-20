import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLoadingIndicator } from './shared/components/router-loading-indicator/router-loading-indicator';

@Component({
  selector: 'root',
  imports: [RouterOutlet, RouterLoadingIndicator],
  template: `
    <router-loading-indicator />
    <router-outlet />
  `
})
export class App {}
