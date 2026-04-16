import { Component } from '@angular/core';

@Component({
  selector: 'home',
  template: '<main class="home-page"></main>',
  styles: [`
    .home-page {
      min-height: 100vh;
      background-color: #0a0520;
    }
  `]
})
export class Home {}
