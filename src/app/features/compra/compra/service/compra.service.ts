import { Injectable } from "@angular/core";
import { ServiceBase } from "../../../../core/services/service-base";
import { CompraOutput } from "../../solicitud/dto/compra.output";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";


@Injectable()
export class CompraService extends ServiceBase<CompraOutput, CommonResponse<any>> {

    constructor() {
        super('compras');
    }

    getLastCompra() {
        return this.http.get<CommonResponse<ListResponse<CompraOutput>>>(`${this.getUrl()}?sort=compra_id,DESC&page=0&size=1`);
    }
}
