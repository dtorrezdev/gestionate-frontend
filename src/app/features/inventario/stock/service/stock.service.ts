import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CommonResponse } from "../../../venta/cliente/dto/interface";
import { ListStockOutput, StockByProductoOutput } from "../dtos/stock-by-producto.output";

@Injectable()
export class StockService {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/stocks';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzY5NzUwODgsImV4cCI6MTc3Njk4MjI4OH0.4552TXY4fsuXVbdo9nTtKoet-zw0tVVJLzKsIHcwsko';

    getStockByProducto(presentacionId: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListStockOutput>>(
            `${this._API}/${presentacionId}`,
            { headers }
        );
    }

    getStocksAll() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<Record<string, StockByProductoOutput[]>>>(
            `${this._API}`,
            { headers }
        );
    }
}
