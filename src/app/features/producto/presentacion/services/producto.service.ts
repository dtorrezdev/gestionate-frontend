import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonResponse, ListResponse } from '../../../venta/cliente/dto/interface';
import { PresentacionOuput } from '../dto/presentacion.output';
import { PresentacionInput } from '../dto/presentacion.input';
import { PresentacionSave } from '../dto/presentacion.save';
import { ServiceBase } from '../../../../core/services/service-base';

@Injectable()
export class ProductService extends ServiceBase<PresentacionInput, CommonResponse<any>> {

    constructor() {
        super('producto_presentacion_v2');
    }
    // size=1000&sort=presentacion_id,desc

    // Refacrotizar
    updatePresentacion(presentacion: PresentacionInput, id: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.put<PresentacionSave>(`http://localhost:8080/modulobase/api/v1/producto_presentacion/${id}`, JSON.stringify(presentacion), { headers });
    }
    // Refacrotizar
    deletePresentacion(id: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(`${this.getUrl()}`, { headers, body: JSON.stringify({ id }) });
    }

}
