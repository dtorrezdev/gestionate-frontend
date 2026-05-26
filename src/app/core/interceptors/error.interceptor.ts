import { catchError, Observable, throwError } from "rxjs";
import { HttpResponseUtil } from "../utils/http.response.util";
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "../../auth/login/services/auth-service";
import { Router } from "@angular/router";
import { ToastService } from "../services/toast.service";


export function errorInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {

    const authService = inject(AuthService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('HTTP ERROR:', error);
            const message = HttpResponseUtil.resolveErrorMessage(error);

            switch (error.status) {
                case 401:
                    authService.logoutFake();
                    setTimeout(() => router.navigate(['/login']), 1000);
                    console.log('errorInterceptor '+ JSON.stringify(message));
                    break;
                case 403:
                    router.navigate(['/access-denied']);
                    break;
                case 404:
                    router.navigate(['/notfound']);
                    break;
                case 500:
                    router.navigate(['/error']);
                    break;
            }
            toastService.error(message);
            return throwError(() => message);
        })
    );
}
