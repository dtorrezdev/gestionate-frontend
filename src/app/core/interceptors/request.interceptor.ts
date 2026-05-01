import { HttpEvent, HttpEventType, HttpHandlerFn, HttpHeaders, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable, tap } from "rxjs";
import { AuthService } from "../../auth/login/services/auth-service";
import { Router } from "@angular/router";


export function requestInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {

    const authToken = inject(AuthService).getAuthToken();
    const currentUrl = inject(Router).url;

    let headers = new HttpHeaders(); // enviar por Interceptor
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Forwarded-For', '');
    // headers = headers.set('Referer', currentUrl);
    headers = headers.set('Route', currentUrl);

    if(!req.url.includes('/v1/autenticacion')) {
        headers = headers.set('Authorization', authToken);
        headers = headers.set('Tenant-Id', "100");
    }

    const newReq = req.clone({ headers });
    console.log(newReq);

    return next(newReq)
    // .pipe(
    //     // siquiero controlar algo en Response | Errores
    //     tap((event) => {
    //         if (event.type === HttpEventType.Response) {
    //             console.log(req.url, 'returned a response with status', event.status);
    //         }

    //     }),
    // );
}
