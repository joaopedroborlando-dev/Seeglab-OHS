import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    // We avoid injecting AuthService directly at the top level to prevent potential circular dependency
    // if AuthService uses HttpClient. However, inside the function body usually it's fine
    // or we can use Injector if needed. For now let's try direct inject as it's cleaner
    // and modern Angular usually handles this if providedAtRoot.
    // Actually, to be safe and avoid "Circular dependency in DI detected for AuthService",
    // we can just use the token from CookieService if we want, but we need logout() from AuthService.
    // Let's rely on angular's ability or lazy retrieve if needed.
    // Using direct inject for now.
    const authService = inject(AuthService);

    const token = authService.getToken();
    let request = req;

    if (token) {
        request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                authService.logout();
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
