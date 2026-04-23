import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MovimientoInput } from "../dtos/movimiento.input";
import { StockByProductoOutput } from "../../stock/dtos/stock-by-producto.output";
import { CommonResponse } from "../../../venta/cliente/dto/interface";


@Injectable()
export class MovimientoService  {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/movimientos';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzY5NzUwODgsImV4cCI6MTc3Njk4MjI4OH0.4552TXY4fsuXVbdo9nTtKoet-zw0tVVJLzKsIHcwsko';

    saveMovimiento(movimiento: MovimientoInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post(this._API, JSON.stringify(movimiento), { headers });
    }

    constructor() { }

}
