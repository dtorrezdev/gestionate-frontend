import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CategoriaOutput } from "../dto/categoria-output";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { Observable } from "rxjs";

@Injectable()
export class CategoriaService {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/categorias';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzY5NzUwODgsImV4cCI6MTc3Njk4MjI4OH0.4552TXY4fsuXVbdo9nTtKoet-zw0tVVJLzKsIHcwsko';

    constructor() { }

    getAllCategorias() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<CategoriaOutput>>>(`${this._API}?size=1000&sort=categoria_id,desc`, { headers: headers });
    }

    saveCategoria(data: CategoriaOutput): Observable<CommonResponse<CategoriaOutput>> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post<CommonResponse<CategoriaOutput>>(this._API, JSON.stringify(data), { headers });
    }

    updateCategoria(data: CategoriaOutput, id: number): Observable<CommonResponse<CategoriaOutput>> {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.put<CommonResponse<CategoriaOutput>>(`${this._API}/${id}`, JSON.stringify(data), { headers });
    }

    deleteCategoria(marca: CategoriaOutput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(`${this._API}`, { headers, body: JSON.stringify(marca) });
    }

}
