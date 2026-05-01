import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MovimientoInput } from "../dtos/movimiento.input";
import { StockByProductoOutput } from "../../stock/dtos/stock-by-producto.output";
import { CommonResponse } from "../../../venta/cliente/dto/interface";
import { ServiceBase } from "../../../../core/services/service-base";


@Injectable()
export class MovimientoService extends ServiceBase<MovimientoInput, CommonResponse<any>> {

    constructor() {
        super('movimientos');
    }

    // saveMovimiento(movimiento: MovimientoInput) {
    //     return this.http.post(this.getUrl(), JSON.stringify(movimiento));
    // }

}
