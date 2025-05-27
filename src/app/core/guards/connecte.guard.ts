import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@app/core/services/auth.service';

export const connecteGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);

  if (auth.isAuthenticated()) {
    return true;
  }

  const router = inject(Router);
  return router.parseUrl('/auth/login');
};
