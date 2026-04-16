import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { MarcaInput } from "../dto/marca.input";
import { MarcaOutput } from "../dto/marca.output";
import { Observable } from "rxjs";


@Injectable()
export class MarcaService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/marcas';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzYyODU3OTEsImV4cCI6MTc3NjI5Mjk5MX0.5PLAp92BomKmkQ__H-eRq4g85-z_fe8l4ZAJfS8zdhI';

    constructor(private http: HttpClient) { }

    getAllMarcas() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<MarcaOutput>>>(`${this._API}?size=1000&sort=marca_id,desc`, { headers: headers });
    }

    saveMarca(data: MarcaInput): Observable<CommonResponse<MarcaOutput>> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post<CommonResponse<MarcaOutput>>(this._API, JSON.stringify(data), { headers });
    }

}
