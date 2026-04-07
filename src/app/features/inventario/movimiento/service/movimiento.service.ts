import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MovimientoInput } from "../dtos/movimiento.input";


@Injectable()
export class MovimientoService  {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/movimientos';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU2MDA0NjYsImV4cCI6MTc3NTYwNzY2Nn0.HM7sPYsRH70rGe6xZ2ggP0-0UCpk9i8Qyhbqg-2Y1DQ';

    saveMovimiento(movimiento: MovimientoInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post(this._API, JSON.stringify(movimiento), { headers });
    }

    constructor() { }

}
