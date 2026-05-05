import { Injectable } from "@angular/core";
import { CompraOutput } from "../../solicitud/dto/compra.output";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { ServiceBase } from "../../../../core/services/service-base";


@Injectable()
export class RecepcionService extends ServiceBase<CompraOutput, CommonResponse<any>> {

    constructor() {
        super('recepciones');
    }

    getLastRecepcion() {
        return this.http.get<CommonResponse<ListResponse<CompraOutput>>>(`${this.getUrl()}?sort=recepcion_producto_id,DESC&page=0&size=1`);
    }
}
