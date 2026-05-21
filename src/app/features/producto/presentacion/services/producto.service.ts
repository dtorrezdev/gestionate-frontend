import { Injectable } from '@angular/core';
import { CommonResponse } from '../../../venta/cliente/dto/interface';
import { PresentacionInput } from '../dto/presentacion.input';
import { ServiceBase } from '../../../../core/services/service-base';

@Injectable()
export class ProductService extends ServiceBase<PresentacionInput, CommonResponse<any>> {

    constructor() {
        super('producto_presentacion');
    }
    // size=1000&sort=presentacion_id,desc

    // Refacrotizar
    deletePresentacion(id: number) {
        return this.http.delete(`${this.getUrl()}`, { body: JSON.stringify({ id }) });
    }

}
