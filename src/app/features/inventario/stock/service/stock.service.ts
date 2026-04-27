import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CommonResponse } from "../../../venta/cliente/dto/interface";
import { ListStockOutput, StockByProductoOutput } from "../dtos/stock-by-producto.output";
import { ServiceBase } from "../../../../core/services/service-base";

@Injectable()
export class StockService extends ServiceBase<StockByProductoOutput, CommonResponse<any>> {

    constructor() {
        super('stocks');
    }

    getStockByProducto(presentacionId: number) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListStockOutput>>(
            `${this.getUrl()}/${presentacionId}`,
            { headers }
        );
    }

    getStocksAll() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<Record<string, StockByProductoOutput[]>>>(
            `${this.getUrl()}`,
            { headers }
        );
    }
}
