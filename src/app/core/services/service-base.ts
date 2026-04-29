import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject } from "@angular/core";
import { Observable } from "rxjs";
import { IService } from "../interface/iservice";
import { Paginacion } from "../interface/paginacion";
import { ServiceUtil } from "../utils/service.util";


export class ServiceBase<I, O> implements IService<I,O> {

    protected http = inject(HttpClient);
    // protected config = inject('config');
    protected readonly _API: string = 'http://localhost:8080/modulobase/api/v1/';
    protected _TOKEN: string = 'XYZ';

    constructor(private endpoint: string) {
        this._TOKEN = localStorage.getItem('token') || '';
    }

    list(param?: I, page?: Paginacion): Observable<any> {
        return ServiceUtil.list(this.http, this.getUrl(), undefined, undefined);
    }
    get(id: number): Observable<O> {
        return ServiceUtil.get(this.http, `${this.getUrl()}/${id}`);
    }

    save(data: I): Observable<O> {
        return ServiceUtil.create<I, O>(this.http, this.getUrl(), data);
    }

    update(data: I, id: number): Observable<O> {
        return ServiceUtil.update<I, O>(this.http, `${this.getUrl()}/${id}`, data);
    }

    delete(id: number): Observable<any> {
        return ServiceUtil.delete(this.http, `${this.getUrl()}/${id}`);
    }

    protected getUrl(): string {
        return `${this._API}${this.endpoint}`;
    }

}
