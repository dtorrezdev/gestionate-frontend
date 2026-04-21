import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CommonResponse } from "../../../venta/cliente/dto/interface";
import { StockByProductoOutput } from "../dtos/stock-by-producto.output";



@Injectable()
export class StockService {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/stocks';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzY3MTYzODEsImV4cCI6MTc3NjcyMzU4MX0.D02vWDRsDLXvu7Ogai3uTPL6Bh1wH8PpzV_HNmj9tO8';

    getStockByProducto(productoId: number, presentacionId: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<StockByProductoOutput[]>>(
            `${this._API}?productoId=${productoId}&presentacionId=${presentacionId}`,
            { headers }
        );
    }
}
