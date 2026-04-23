import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { UbicacionStockOutput } from "../dtos/ubicacion-stock.outpu";
import { Observable } from "rxjs";

@Injectable()
export class UbicacionStockService {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/ubicacion_stock';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzY5NzUwODgsImV4cCI6MTc3Njk4MjI4OH0.4552TXY4fsuXVbdo9nTtKoet-zw0tVVJLzKsIHcwsko';

    getAllUbicacionStock() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<UbicacionStockOutput>>>(`${this._API}?size=1000&sort=ubicacion_stock_id,desc`, { headers: headers });
    }

    saveUbicacionStock(data: UbicacionStockInput): Observable<CommonResponse<UbicacionStockOutput>> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post<CommonResponse<UbicacionStockOutput>>(this._API, JSON.stringify(data), { headers });
    }

    updateUbicacionStock(data: UbicacionStockInput, id: number): Observable<CommonResponse<UbicacionStockOutput>> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.put<CommonResponse<UbicacionStockOutput>>(`${this._API}/${id}`, JSON.stringify(data), { headers });
    }

    deleteUbicacionStock(ubicacion: UbicacionStockOutput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(this._API, { headers, body: JSON.stringify(ubicacion) });
    }

    constructor() { }
}
