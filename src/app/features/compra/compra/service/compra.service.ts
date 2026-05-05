import { Injectable } from "@angular/core";
import { ServiceBase } from "../../../../core/services/service-base";
import { CompraOutput } from "../../solicitud/dto/compra.output";
import { CommonResponse } from "../../../venta/cliente/dto/interface";


@Injectable()
export class CompraService extends ServiceBase<CompraOutput, CommonResponse<any>> {

    constructor() {
        super('compras');
    }
}
