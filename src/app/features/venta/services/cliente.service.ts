import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../cliente/dto/interface";
import { ClienteOutput } from "../cliente/dto/cliente.output";
import { ClienteInput } from "../cliente/dto/cliente.input";


@Injectable()
export class ClienteService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/clientes';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU1MDczNzgsImV4cCI6MTc3NTUxNDU3OH0.YPj8GZftAB5OF6tEtyU-zRLkE-2mvWMYPYRV13cHtAIeyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzU1MDczNzgsImV4cCI6MTc3NTUxNDU3OH0.YPj8GZftAB5OF6tEtyU-zRLkE-2mvWMYPYRV13cHtAI';

    constructor(private http: HttpClient) { }

    getAllCliente() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.get<CommonResponse<ListResponse<ClienteOutput>>>(this._API, { headers: headers });
    }

    saveCliente(data: ClienteInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post(this._API, data, { headers });
    }

}
