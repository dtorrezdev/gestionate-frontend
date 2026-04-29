import { Injectable } from "@angular/core";
import { CommonResponse } from "../../../venta/cliente/dto/interface";
import { MarcaInput } from "../dto/marca.input";
import { ServiceBase } from "../../../../core/services/service-base";


@Injectable()
export class MarcaService extends ServiceBase<MarcaInput, CommonResponse<any>> {

    constructor() {
        super('marcas');
    }
    // ${this._API}marcas?size=1000&sort=marca_id,desc`
}
