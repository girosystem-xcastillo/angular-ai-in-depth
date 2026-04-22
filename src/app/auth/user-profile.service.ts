import { Injectable, signal } from '@angular/core';
import { UserProfile } from './auth.model';

export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_PROFILE_KEY = 'user_profile';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly profileState = signal<UserProfile | null>(null);

  readonly profile = this.profileState.asReadonly();

  constructor() {
    const stored = localStorage.getItem(USER_PROFILE_KEY);
    if (stored) {
      this.profileState.set(JSON.parse(stored));
    }
  }

  saveSession(token: string, user: UserProfile) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
    this.profileState.set(user);
  }

  clearSession() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_PROFILE_KEY);
    this.profileState.set(null);
  }
}
