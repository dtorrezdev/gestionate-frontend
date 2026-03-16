import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface Cliente {
    id?: string,
    nombre?: string,
    ci?: string,
    celular?: string,
}

@Injectable()
export class ClienteService {

    constructor(private http: HttpClient) { }

    private getClientesData() {
        return [
            {
                id: '1099',
                nombre: 'Rediff Main WIll McEncroe',
                ci: '328992389',
                celular: '73492312'
            },
            {
                id: '10100',
                nombre: 'Rediff Main WIll McEncroe',
                ci: '328992389',
                celular: '73492312'
            },
            {
                id: '10101',
                nombre: 'Rediff Main WIll McEncroe',
                ci: '328992389',
                celular: '73492312'
            },
            {
                id: '10102',
                nombre: 'Rediff Main WIll McEncroe',
                ci: '328992389',
                celular: '73492312'
            },
            {
                id: '10103',
                nombre: 'Rediff Main WIll McEncroe',
                ci: '328992389',
                celular: '73492312'
            },
            {
                id: '10104',
                nombre: 'Rediff Main WIll McEncroe',
                ci: '328992389',
                celular: '73492312'
            },
            {
                id: '10105',
                nombre: 'Rediff Main WIll McEncroe',
                ci: '328992389',
                celular: '73492312'
            },
            {
                id: '10106',
                nombre: 'Rediff Main WIll McEncroe',
                ci: '328992389',
                celular: '73492312'
            },
            {
                id: '10107',
                nombre: 'Rediff Main WIll McEncroe',
                ci: '328992389',
                celular: '73492312'
            },
        ];
    }

    getClientes() {
        return Promise.resolve(this.getClientesData());
    }

}
