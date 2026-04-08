import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ProductoBaseOutput } from "../dto/producto.base.output";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";


@Injectable()
export class ProductoBaseService {
    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/productos';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU2NjE0OTMsImV4cCI6MTc3NTY2ODY5M30.omwWAUs709jG0Hpb8AVw7ne8a2_XpB3H3EB9nuWbty4';

    constructor(private http: HttpClient) { }

    getAllProductoBase() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<ListResponse<ProductoBaseOutput>>
            (`${this._API}?size=1000&page=0&sort=producto_id,desc&codigo=&nombre&descripcion`, { headers: headers });
    }
}
