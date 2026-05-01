import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VentaInput } from "../venta/dto/venta.input";
import { VentaOutput } from "../venta/dto/venta.output";
import { CommonResponse, ListResponse } from "../cliente/dto/interface";
import { VentaDelete } from "../venta/dto/venta.delete";
import { ServiceBase } from "../../../core/services/service-base";


@Injectable()
export class VentaService extends ServiceBase<VentaInput, CommonResponse<any>> {

    constructor() {
        super('ventas');
    }

    deleteVenta(venta: VentaDelete) {
        return this.http.delete(this.getUrl(), { body: JSON.stringify(venta) });
    }

    getLastVenta() {
        return this.http.get<CommonResponse<ListResponse<VentaOutput>>>(`${this.getUrl()}?sort=venta_id,DESC&page=0&size=1`);
    }

}
