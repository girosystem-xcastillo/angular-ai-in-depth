import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserProfileService } from './user-profile.service';

export const authGuard: CanActivateFn = () => {
  const userProfile = inject(UserProfileService);
  const router = inject(Router);

  if (userProfile.profile()) {
    return true;
  }

  return router.createUrlTree(['/sign-in']);
};
