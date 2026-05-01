import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { UbicacionStockOutput } from "../dtos/ubicacion-stock.outpu";
import { Observable } from "rxjs";
import { ServiceBase } from "../../../../core/services/service-base";

@Injectable()
export class UbicacionStockService extends ServiceBase<UbicacionStockInput, CommonResponse<any>> {

    deleteUbicacionStock(ubicacion: UbicacionStockOutput) {
        return this.http.delete(this.getUrl(), { body: JSON.stringify(ubicacion) });
    }

    constructor() {
        super('ubicacion_stock');
    }
}
