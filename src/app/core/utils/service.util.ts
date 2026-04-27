import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpResponseUtil } from './http.response.util';
import { Paginacion } from '../interface/paginacion';
import { catchError, Observable, } from 'rxjs';

export class ServiceUtil {

    private static readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzczMjUxOTEsImV4cCI6MTc3NzMzMjM5MX0.GLTpblwMmt1-ITmmkjIEQZ76kRZDNLIsE2dDK61k7X8';

    public static get<T>(http: HttpClient, url: string): Observable<T> {
        let headers = new HttpHeaders(); // enviar por Interceptor
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', ServiceUtil._TOKEN);
        return http.get<T>(url, {headers})
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }

    public static list<T>(http: HttpClient, url: string,
        parametros?: Map<string, string>, input?: Paginacion): Observable<T> {
        let headers = new HttpHeaders(); // enviar por Interceptor
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', ServiceUtil._TOKEN);
        return http.get<T>(url, {headers})
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }

    public static create<I, T>(http: HttpClient, url: string, input: I): Observable<T> {
        let headers = new HttpHeaders(); // enviar por Interceptor
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', ServiceUtil._TOKEN);

        return http.post<T>(url, input, {headers})
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }

    public static update<I, T>(http: HttpClient, url: string, input: I): Observable<T> {
        let headers = new HttpHeaders(); // enviar por Interceptor
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', ServiceUtil._TOKEN);
        return http.put<T>(url, input, {headers})
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }

    public static delete(http: HttpClient, url: string): Observable<any> {
        let headers = new HttpHeaders(); // enviar por Interceptor
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', ServiceUtil._TOKEN);
        return http.delete(url, {headers})
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }
}
