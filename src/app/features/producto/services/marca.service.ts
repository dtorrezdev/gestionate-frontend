import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../venta/cliente/dto/interface";
import { MarcaInput } from "../marca/dto/marca.input";
import { MarcaOutput } from "../marca/dto/marca.output";


@Injectable()
export class MarcaService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/marcas';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzQzMDc3MTksImV4cCI6MTc3NDMxNDkxOX0.Fe5wk5PVneXyJWV7FLTVlR3Ex-zYMEoqvNEArsOLD-E';

    constructor(private http: HttpClient) { }

    getAllMarcas() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<MarcaOutput>>>(this._API, { headers: headers });
    }

    saveCliente(data: MarcaInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post(this._API, data, { headers });
    }

}
