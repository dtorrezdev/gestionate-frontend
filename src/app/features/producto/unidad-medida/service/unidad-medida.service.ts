import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { UnidadMedidaOuput } from "../dto/unidad-medida.output";
import { UnidadMedidaInput } from "../dto/unidad-medida.input";
import { Observable } from "rxjs";


@Injectable()
export class UnidadMedidaService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/unidades_medidas';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzY4ODkyMDMsImV4cCI6MTc3Njg5NjQwM30.WVeJ5K2lrzJAZ9dBKsSTzQu1VNm9XlW5EmB7xoxwx1Q';

    constructor(private http: HttpClient) { }

    getAllUnidadMedida() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<UnidadMedidaOuput>>>(`${this._API}?size=1000&sort=unidad_medida_id,ASC`, { headers: headers });
    }

    saveUnidadMedida(data: UnidadMedidaInput): Observable<CommonResponse<UnidadMedidaOuput>> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post<CommonResponse<UnidadMedidaOuput>>(this._API, JSON.stringify(data), { headers });
    }

    deleteUnidadMedida(unidad: UnidadMedidaOuput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(this._API, { headers, body: JSON.stringify(unidad) });
    }
}
