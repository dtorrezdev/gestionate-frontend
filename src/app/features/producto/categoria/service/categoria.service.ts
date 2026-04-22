import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CategoriaOutput } from "../dto/categoria-output";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";



@Injectable()
export class CategoriaService {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/categorias';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzY4ODkyMDMsImV4cCI6MTc3Njg5NjQwM30.WVeJ5K2lrzJAZ9dBKsSTzQu1VNm9XlW5EmB7xoxwx1Q';

    constructor() { }

    getAllCategorias() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<CategoriaOutput>>>(`${this._API}?size=1000&sort=marca_id,desc`, { headers: headers });
    }

}
