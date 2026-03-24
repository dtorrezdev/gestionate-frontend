import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { VentaInput } from "../venta/dto/venta.input";

export interface Venta {
    id: string,
    cliente: string,
    nit: string,
    total: number,
    fechaCreacion: string,
    vendedor: string,
    estado: string
}


@Injectable()
export class VentaService {

    private readonly _API: string = 'http://localhost:8080/modulobase/api/v1/ventas';
    private readonly _TOKEN: string = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2wiOiJTdXBlciBBZG1pbmlzdHJhZG9yIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3NzQzODM5NzUsImV4cCI6MTc3NDM5MTE3NX0.V-NSsx0tv5dh8H01fnNfRQyuwIhUBcLPlcRjqg18dB8';

    constructor(private http: HttpClient) { }

    private getVentasData() {
        return [
            {
                id: '1099',
                cliente: 'Rediff Main WIll McEncroe',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },
            {
                id: '1100',
                cliente: 'David Torrez',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },
            {
                id: '1101',
                cliente: 'f230fh0g3',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },
            {
                id: '1102',
                cliente: 'f230fh0g3',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },

            {
                id: '1101',
                cliente: 'f230fh0g3',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },
            {
                id: '1102',
                cliente: 'f230fh0g3',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },

            {
                id: '1101',
                cliente: 'f230fh0g3',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },
            {
                id: '1102',
                cliente: 'f230fh0g3',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },
            {
                id: '1102',
                cliente: 'f230fh0g3',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },
            {
                id: '1101',
                cliente: 'f230fh0g3',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },
            {
                id: '1102',
                cliente: 'f230fh0g3',
                nit: '328992389',
                total: 15.0,
                fechaCreacion: '01/01/2025 13:16:07',
                vendedor: 'Mitchell Admin',
                estado: 'Preventa'
            },

        ];
    }

    getVentas() {
        return Promise.resolve(this.getVentasData());
    }

    saveVenta(venta: VentaInput) {
        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json');
        headers = headers.set('Authorization', this._TOKEN);
        return this.http.post(this._API, JSON.stringify(venta), { headers });
    }

}
