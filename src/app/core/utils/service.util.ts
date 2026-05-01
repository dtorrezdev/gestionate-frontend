import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpResponseUtil } from './http.response.util';
import { Paginacion } from '../interface/paginacion';
import { catchError, Observable, } from 'rxjs';

export class ServiceUtil {

    public static get<T>(http: HttpClient, url: string): Observable<T> {
        return http.get<T>(url)
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }

    public static list<T>(http: HttpClient, url: string,
        parametros?: Map<string, string>, input?: Paginacion): Observable<T> {
        let hp: HttpParams = new HttpParams();
        if (input === null || input === undefined) {
            hp = hp.set('size', '2000').set('page', '0');
        } else {
            hp = hp.set('size', input.size.toString()).set('page', input.page.toString())
                .set('sort', input.sort.col + ',' + input.sort.type);
        }

        return http.get<T>(url, { params: hp })
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }

    public static create<I, T>(http: HttpClient, url: string, input: I): Observable<T> {
        return http.post<T>(url, input)
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }

    public static update<I, T>(http: HttpClient, url: string, input: I): Observable<T> {
        return http.put<T>(url, input)
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }

    public static delete(http: HttpClient, url: string): Observable<any> {
        return http.delete(url)
            .pipe(catchError(HttpResponseUtil.handleErrorGeneric));
    }
}
