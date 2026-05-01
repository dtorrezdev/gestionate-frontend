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

        return this.http.get<CommonResponse<ListStockOutput>>(`${this.getUrl()}/${presentacionId}`);
    }

    getStocksAll() {

        return this.http.get<CommonResponse<Record<string, StockByProductoOutput[]>>>(`${this.getUrl()}`);
    }
}
