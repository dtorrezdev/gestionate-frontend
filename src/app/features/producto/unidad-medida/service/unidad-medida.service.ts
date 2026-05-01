import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonResponse } from "../../../venta/cliente/dto/interface";
import { UnidadMedidaOuput } from "../dto/unidad-medida.output";
import { UnidadMedidaInput } from "../dto/unidad-medida.input";
import { ServiceBase } from "../../../../core/services/service-base";


@Injectable()
export class UnidadMedidaService extends ServiceBase<UnidadMedidaInput, CommonResponse<any>> {

    constructor() {
        super('unidades_medidas');
    }

    deleteUnidadMedida(unidad: UnidadMedidaOuput) {
        return this.http.delete(this.getUrl(), { body: JSON.stringify(unidad) });
    }
}
