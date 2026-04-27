import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../cliente/dto/interface";
import { ClienteOutput } from "../cliente/dto/cliente.output";
import { ClienteInput } from "../cliente/dto/cliente.input";
import { Observable } from "rxjs";
import { ServiceBase } from "../../../core/services/service-base";


@Injectable()
export class ClienteService extends ServiceBase<ClienteInput, CommonResponse<any>> {

    constructor() {
        super('clientes');
    }

    deleteCliente(data: ClienteOutput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.delete(this.getUrl(), { headers, body: JSON.stringify(data) });
    }
}
