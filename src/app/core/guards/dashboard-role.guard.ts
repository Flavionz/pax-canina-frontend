import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

export function dashboardRoleGuard(
  allowedRole: 'ADMIN' | 'COACH' | 'PROPRIETAIRE'
): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated || !auth.role) {
      return router.parseUrl('/401');
    }
    if (auth.role !== allowedRole) {
      return router.parseUrl('/403');
    }
    return true;
  };
}
