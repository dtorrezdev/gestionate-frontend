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

    getAllProductoBase() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<ListResponse<ProductoBaseOutput>>
            (`${this.getUrl()}?size=1000&page=0&sort=producto_id,desc&codigo=&nombre&descripcion`, { headers: headers });
    }

    saveProducto(data: ProductoBaseOutput): Observable<ProductoBaseOutput> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post<ProductoBaseOutput>(this.getUrl(), JSON.stringify(data), { headers });
    }

    updateProducto(data: ProductoBaseOutput, id: number): Observable<ProductoBaseOutput> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.put<ProductoBaseOutput>(`${this.getUrl()}/${id}`, JSON.stringify(data), { headers });
    }

    deleteProducto(marca: ProductoBaseOutput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(`${this.getUrl()}/${marca.id}`, { headers });
    }
}
