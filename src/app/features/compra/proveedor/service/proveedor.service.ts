import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { ProveedorInput } from "../dto/proveedor.input";
import { ProveedorOutput } from "../dto/proveedor.output";
import { Observable } from "rxjs";
import { ServiceBase } from "../../../../core/services/service-base";


@Injectable()
export class ProveedorService extends ServiceBase<ProveedorInput, CommonResponse<any>> {

    constructor() {
        super('proveedores');
    }

    // Refacrotizar
    deleteProveedor(data: ProveedorInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(`${this.getUrl()}`, { headers, body: JSON.stringify(data) });
    }
}
