import { Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

interface SignUpData {
  email: string;
  password: string;
  confirmPassword: string;
}

@Component({
  selector: 'sign-up',
  imports: [RouterLink, NgOptimizedImage, FormField],
  templateUrl: './sign-up.html',
  styleUrls: ['../auth-shared.scss', './sign-up.scss'],
})
export class SignUp {
  protected readonly model = signal<SignUpData>({ email: '', password: '', confirmPassword: '' });

  protected readonly f = form(this.model, (p) => {
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email address' });
    required(p.password, { message: 'Password is required' });
    required(p.confirmPassword, { message: 'Please confirm your password' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    // Registration logic will be wired up separately
  }
}
