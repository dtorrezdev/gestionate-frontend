import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MovimientoInput } from "../dtos/movimiento.input";


@Injectable()
export class MovimientoService  {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/movimientos';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU2NjE0OTMsImV4cCI6MTc3NTY2ODY5M30.omwWAUs709jG0Hpb8AVw7ne8a2_XpB3H3EB9nuWbty4';

    saveMovimiento(movimiento: MovimientoInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post(this._API, JSON.stringify(movimiento), { headers });
    }

    constructor() { }

}
