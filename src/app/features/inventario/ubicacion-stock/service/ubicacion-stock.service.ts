import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { UbicacionStockOutput } from "../dtos/ubicacion-stock.outpu";
import { Observable } from "rxjs";
import { ServiceBase } from "../../../../core/services/service-base";

@Injectable()
export class UbicacionStockService extends ServiceBase<UbicacionStockInput, CommonResponse<any>> {

    // private http = inject(HttpClient);

    // private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/ubicacion_stock';

    // getAllUbicacionStock() {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json');
    //     headers = headers.set('Authorization', this._TOKEN);
    //     return this.http.get<CommonResponse<ListResponse<UbicacionStockOutput>>>(`${this._API}?size=1000&sort=ubicacion_stock_id,desc`, { headers: headers });
    // }

    // saveUbicacionStock(data: UbicacionStockInput): Observable<CommonResponse<UbicacionStockOutput>> {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json');
    //     headers = headers.set('Authorization', this._TOKEN);
    //     return this.http.post<CommonResponse<UbicacionStockOutput>>(this._API, JSON.stringify(data), { headers });
    // }

    // updateUbicacionStock(data: UbicacionStockInput, id: number): Observable<CommonResponse<UbicacionStockOutput>> {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json');
    //     headers = headers.set('Authorization', this._TOKEN);
    //     return this.http.put<CommonResponse<UbicacionStockOutput>>(`${this._API}/${id}`, JSON.stringify(data), { headers });
    // }

    deleteUbicacionStock(ubicacion: UbicacionStockOutput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(this.getUrl(), { headers, body: JSON.stringify(ubicacion) });
    }

    constructor() {
        super('ubicacion_stock');
    }
}
