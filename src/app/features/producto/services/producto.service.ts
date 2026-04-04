import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonResponse, ListResponse } from '../../venta/cliente/dto/interface';
import { ClienteOutput } from '../../venta/cliente/dto/cliente.output';
import { PresentacionOuput } from '../presentacion/dto/presentacion.output';
import { PresentacionInput } from '../presentacion/dto/presentacion.input';

interface InventoryStatus {
    label: string;
    value: string;
}


@Injectable()
export class ProductService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/producto_presentacion';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzUyNDk4MzQsImV4cCI6MTc3NTI1NzAzNH0.GwaVI5p9cS9kljT8j8S1xXvm-M6VZKoJ_bAvN6nIJrs';

    constructor(private http: HttpClient) { }

    getAllProdutos() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);

        return this.http.get<CommonResponse<ListResponse<PresentacionOuput>>>(`${this._API}_v2?size=1000&sort=presentacion_id,desc`, { headers: headers });
    }

    savePresentacion(presentacion: PresentacionInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post(this._API, JSON.stringify(presentacion), { headers });
    }


}
