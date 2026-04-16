import { Component, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';

interface SignInData {
  email: string;
  password: string;
}

@Component({
  selector: 'sign-in',
  imports: [RouterLink, NgOptimizedImage, FormField],
  templateUrl: './sign-in.html',
  styleUrls: ['../auth-shared.scss', './sign-in.scss'],
})
export class SignIn {
  protected readonly model = signal<SignInData>({ email: '', password: '' });

  protected readonly f = form(this.model, (p) => {
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email address' });
    required(p.password, { message: 'Password is required' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    // Authentication logic will be wired up separately
  }
}
