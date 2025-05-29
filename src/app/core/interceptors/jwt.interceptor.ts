import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwt = localStorage.getItem('jwt');
  console.log('Interceptor attivo. JWT:', jwt, 'URL:', req.url); // <--- AGGIUNGI QUESTA RIGA
  if (jwt) {
    const reqWithJwt = req.clone({
      setHeaders: { Authorization: 'Bearer ' + jwt }
    });
    return next(reqWithJwt);
  }
  return next(req);
};
