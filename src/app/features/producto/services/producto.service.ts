import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonResponse, ListResponse } from '../../venta/cliente/dto/interface';
import { PresentacionOuput } from '../presentacion/dto/presentacion.output';
import { PresentacionInput } from '../presentacion/dto/presentacion.input';
import { PresentacionSave } from '../presentacion/dto/presentacion.save';

@Injectable()
export class ProductService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/producto_presentacion_v2';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzY5NzUwODgsImV4cCI6MTc3Njk4MjI4OH0.4552TXY4fsuXVbdo9nTtKoet-zw0tVVJLzKsIHcwsko';

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

    getProdutoPresentacion(id: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);

        return this.http.get<CommonResponse<PresentacionOuput>>(`${this._API}/${id}`, { headers: headers });
    }

    updatePresentacion(presentacion: PresentacionInput, id: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.put<PresentacionSave>(`http://localhost:8080/modulobase/api/v1/producto_presentacion/${id}`, JSON.stringify(presentacion), { headers });
    }

    deletePresentacion(id: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(`${this._API}`, { headers, body: JSON.stringify({ id }) });
    }

}
