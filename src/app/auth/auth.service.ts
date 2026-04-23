import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthResponse } from './auth.model';
import { UserProfileService } from './user-profile.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly userProfileService = inject(UserProfileService);

  async signIn(email: string, password: string) {
    return firstValueFrom(this.http.post<AuthResponse>('/api/sign-in', { email, password }));
  }

  async signUp(email: string, password: string) {
    return firstValueFrom(this.http.post<AuthResponse>('/api/sign-up', { email, password }));
  }

  async logout() {
    this.userProfileService.clearSession();
    await this.router.navigate(['/sign-in']);
  }
}
