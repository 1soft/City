import { HttpInterceptorFn } from '@angular/common/http';
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const currentToken = localStorage.getItem('token') || undefined;
  if (currentToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${currentToken}`
      }
    });
  }
  return next(req);
};