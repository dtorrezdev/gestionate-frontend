import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CategoriaOutput } from "../dto/categoria-output";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { Observable } from "rxjs";
import { ServiceBase } from "../../../../core/services/service-base";

@Injectable()
export class CategoriaService extends ServiceBase<CategoriaOutput, CommonResponse<any>> {

    constructor() {
        super('categorias');
    }

    // Refacrotizar
    deleteCategoria(data: CategoriaOutput) {
        return this.http.delete(`${this.getUrl()}`, { body: JSON.stringify(data) });
    }

}
