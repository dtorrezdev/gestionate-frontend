import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonResponse, ListResponse } from '../../venta/cliente/dto/interface';
import { PresentacionOuput } from '../presentacion/dto/presentacion.output';
import { PresentacionInput } from '../presentacion/dto/presentacion.input';
import { PresentacionSave } from '../presentacion/dto/presentacion.save';

@Injectable()
export class ProductService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/producto_presentacion_v2';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU4NTExNzksImV4cCI6MTc3NTg1ODM3OX0.lD0XNNMl-W7W7NL3V_zsQK41LuZoXDNtP2vp8iF_nYk';

    constructor(private http: HttpClient) { }

    getAllProdutos() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);

        return this.http.get<CommonResponse<ListResponse<PresentacionOuput>>>(`${this._API}?size=1000&sort=presentacion_id,desc`, { headers: headers });
    }

    savePresentacion(presentacion: PresentacionInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post<CommonResponse<PresentacionSave>>(this._API, JSON.stringify(presentacion), { headers });
    }

}
