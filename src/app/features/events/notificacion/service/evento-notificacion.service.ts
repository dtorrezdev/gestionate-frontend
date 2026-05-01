import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { EventoNotificacion } from "../dtos/evento-notificacion.output";
import { ServiceBase } from "../../../../core/services/service-base";


@Injectable()
export class EventoNotificacionService extends ServiceBase<EventoNotificacion, CommonResponse<any>> {

    constructor() {
        super('evento_notificacion');
    }

    // getAllEventoNotificacion() {

    //     return this.http.get<CommonResponse<ListResponse<EventoNotificacion>>>(`${this.getUrl()}?size=1000&sort=presentacion_id,desc`);
    // }
}
