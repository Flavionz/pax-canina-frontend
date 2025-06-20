import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/login')
  ) {
    return next(req);
  }
  const jwt = localStorage.getItem('jwt');
  if (jwt) {
    const reqWithJwt = req.clone({
      setHeaders: { Authorization: 'Bearer ' + jwt }
    });
    return next(reqWithJwt);
  }
  return next(req);
};
