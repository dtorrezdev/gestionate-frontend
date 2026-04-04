import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VentaInput } from "../venta/dto/venta.input";
import { VentaOutput } from "../venta/dto/venta.output";
import { CommonResponse, ListResponse } from "../cliente/dto/interface";
import { VentaDelete } from "../venta/dto/venta.delete";

export interface Venta {
    id: string,
    cliente: string,
    nit: string,
    total: number,
    fechaCreacion: string,
    vendedor: string,
    estado: string
}


@Injectable()
export class VentaService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/ventas';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzUyNDk4MzQsImV4cCI6MTc3NTI1NzAzNH0.GwaVI5p9cS9kljT8j8S1xXvm-M6VZKoJ_bAvN6nIJrs';

    constructor(private http: HttpClient) { }

    getAllVenta() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<VentaOutput>>>(`${this._API}?sort=venta_id,DESC&page=0&size=2000`, { headers: headers });
    }

    saveVenta(venta: VentaInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post(this._API, JSON.stringify(venta), { headers });
    }

    deleteVenta(venta: VentaDelete) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(this._API, { headers, body: JSON.stringify(venta) });
    }

}
