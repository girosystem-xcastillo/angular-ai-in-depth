import { Injectable, signal } from '@angular/core';
import { UserProfile } from './auth.model';

export const AUTH_TOKEN_KEY = 'auth_token';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly profileState = signal<UserProfile | null>(null);

  readonly profile = this.profileState.asReadonly();

  saveSession(token: string, user: UserProfile) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    this.profileState.set(user);
  }

  clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.profileState.set(null);
  }
}
