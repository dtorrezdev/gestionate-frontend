import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

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

}
