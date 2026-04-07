import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { UbicacionStockOutput } from "../dtos/ubicacion-stock.outpu";

@Injectable()
export class UbicacionStockService {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/ubicacion_stock';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU2MDA0NjYsImV4cCI6MTc3NTYwNzY2Nn0.HM7sPYsRH70rGe6xZ2ggP0-0UCpk9i8Qyhbqg-2Y1DQ';

    getAllUbicacionStock() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<UbicacionStockOutput>>>(`${this._API}?size=1000&sort=ubicacion_stock_id,desc`, { headers: headers });
    }

    constructor() { }
}
