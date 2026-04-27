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

    // getAllVenta() {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json');
    //     headers = headers.set('Authorization', this._TOKEN);
    //     return this.http.get<CommonResponse<ListResponse<VentaOutput>>>(`${this.getUrl()}?sort=venta_id,DESC&page=0&size=2000`, { headers: headers });
    // }

    // saveVenta(venta: VentaInput) {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json');
    //     headers = headers.set('Authorization', this._TOKEN);
    //     return this.http.post(this.getUrl(), JSON.stringify(venta), { headers });
    // }

    // updateVenta(venta: VentaInput, id: number) {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json');
    //     headers = headers.set('Authorization', this._TOKEN);
    //     return this.http.put(`${this.getUrl()}/${id}`, JSON.stringify(venta), { headers });
    // }

    deleteVenta(venta: VentaDelete) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(this.getUrl(), { headers, body: JSON.stringify(venta) });
    }

    getLastVenta() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<VentaOutput>>>(`${this.getUrl()}?sort=venta_id,DESC&page=0&size=1`, { headers: headers });
    }

    // getVenta(id: number) {
    //     let headers = new HttpHeaders();
    //     headers = headers.set('Content-Type', 'application/json');
    //     headers = headers.set('Authorization', this._TOKEN);
    //     return this.http.get<CommonResponse<VentaOutput>>(`${this.getUrl()}/${id}`, { headers: headers });
    // }

}
