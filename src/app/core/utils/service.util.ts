import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Paginacion } from '../interface/paginacion';
import { Observable, } from 'rxjs';

export class ServiceUtil {

    public static get<T>(http: HttpClient, url: string): Observable<T> {
        return http.get<T>(url);
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

        return http.get<T>(url, { params: hp });
    }

    public static create<I, T>(http: HttpClient, url: string, input: I): Observable<T> {
        return http.post<T>(url, input);
    }

    public static update<I, T>(http: HttpClient, url: string, input: I): Observable<T> {
        return http.put<T>(url, input);
    }

    public static delete(http: HttpClient, url: string): Observable<any> {
        return http.delete(url);
    }
}
