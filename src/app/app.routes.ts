import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  {
    path: 'sign-in',
    loadComponent: () => import('./auth/sign-in/sign-in').then(m => m.SignIn)
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./auth/sign-up/sign-up').then(m => m.SignUp)
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.Home)
  }
];
