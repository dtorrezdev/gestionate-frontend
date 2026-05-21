import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProductoBaseOutput } from "../dto/producto.base.output";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { Observable } from "rxjs";
import { ServiceBase } from "../../../../core/services/service-base";


@Injectable()
export class ProductoBaseService extends ServiceBase<ProductoBaseOutput, CommonResponse<any>> {
    // Esta service necesita Refactor BE/ FE
    constructor() {
        super('productos');
    }

    deleteProducto(marca: ProductoBaseOutput) {
        return this.http.delete(`${this.getUrl()}/${marca.id}`);
    }
}
