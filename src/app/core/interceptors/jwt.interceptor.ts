import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

const AUTH_WHITELIST = [
  '/auth/login',
  '/auth/register',
  '/auth/password-reset-request',
  '/auth/password-reset',
  '/auth/verify-email',
  '/auth/resend-verification'
];

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Non aggiungere Bearer alle chiamate pubbliche
  if (AUTH_WHITELIST.some(path => req.url.includes(path))) {
    return next(req);
  }

  const jwt = localStorage.getItem('jwt');
  if (!jwt) return next(req);

  const reqWithJwt = req.clone({ setHeaders: { Authorization: `Bearer ${jwt}` } });
  return next(reqWithJwt);
};
