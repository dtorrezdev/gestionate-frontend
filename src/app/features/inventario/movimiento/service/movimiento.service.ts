import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MovimientoInput } from "../dtos/movimiento.input";
import { StockByProductoOutput } from "../../stock/dtos/stock-by-producto.output";
import { CommonResponse } from "../../../venta/cliente/dto/interface";


@Injectable()
export class MovimientoService  {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/movimientos';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU4NTExNzksImV4cCI6MTc3NTg1ODM3OX0.lD0XNNMl-W7W7NL3V_zsQK41LuZoXDNtP2vp8iF_nYk';

    saveMovimiento(movimiento: MovimientoInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post(this._API, JSON.stringify(movimiento), { headers });
    }

    getStockByProducto(productoId: number, presentacionId: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<StockByProductoOutput[]>>(
            `${this._API}/stocks_by_producto?productoId=${productoId}&presentacionId=${presentacionId}`,
            { headers }
        );
    }

    constructor() { }

}
