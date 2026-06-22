import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(mod => mod.HomeComponent),
  },
  { path: '**', redirectTo: '/home' },
];
