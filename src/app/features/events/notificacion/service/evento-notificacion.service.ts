import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { CommonResponse, ListResponse } from "../../../venta/cliente/dto/interface";
import { EventoNotificacion } from "../dtos/evento-notificacion.output";


@Injectable()
export class EventoNotificacionService {

    private http = inject(HttpClient);

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/evento_notificacion';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzY3MTYzODEsImV4cCI6MTc3NjcyMzU4MX0.D02vWDRsDLXvu7Ogai3uTPL6Bh1wH8PpzV_HNmj9tO8';

    getAllEventoNotificacion() {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);

        return this.http.get<CommonResponse<ListResponse<EventoNotificacion>>>(`${this._API}?size=1000&sort=presentacion_id,desc`, { headers: headers });
    }
}
