import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthResponse } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  async signIn(email: string, password: string) {
    return firstValueFrom(this.http.post<AuthResponse>('/api/sign-in', { email, password }));
  }

  async signUp(email: string, password: string) {
    return firstValueFrom(this.http.post<AuthResponse>('/api/sign-up', { email, password }));
  }
}
