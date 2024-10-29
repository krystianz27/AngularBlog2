import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Unauthorized access - logging out.');
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { sessionExpired: true },
        });
      } else {
        console.error(`HTTP Error: ${error.status}`, error.message);
      }
      return throwError(() => new Error(error.message));
    })
  );
};
