import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { UnidadMedidaOuput } from "../dto/unidad-medida.output";


@Injectable()
export class UnidadMedidaService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/unidades_medidas';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU2NjE0OTMsImV4cCI6MTc3NTY2ODY5M30.omwWAUs709jG0Hpb8AVw7ne8a2_XpB3H3EB9nuWbty4';

    constructor(private http: HttpClient) { }

    getAllUnidadMedida() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<UnidadMedidaOuput>>>(`${this._API}?size=1000&sort=unidad_medida_id,ASC`, { headers: headers });
    }


}
