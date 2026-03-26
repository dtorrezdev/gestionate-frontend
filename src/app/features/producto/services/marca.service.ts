import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../venta/cliente/dto/interface";
import { MarcaInput } from "../marca/dto/marca.input";
import { MarcaOutput } from "../marca/dto/marca.output";
import { Observable } from "rxjs";


@Injectable()
export class MarcaService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/marcas';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzQ1NTM0NjUsImV4cCI6MTc3NDU2MDY2NX0.PLev6K8z8mlAHI5-Bn6s-Z2IwxKrfz5YTQ4i-5reW1M';

    constructor(private http: HttpClient) { }

    getAllMarcas() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<MarcaOutput>>>(`${this._API}?sort=marca_id,desc`, { headers: headers });
    }

    saveMarca(data: MarcaInput): Observable<CommonResponse<MarcaOutput>> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post<CommonResponse<MarcaOutput>>(this._API, JSON.stringify(data), { headers });
    }

}
