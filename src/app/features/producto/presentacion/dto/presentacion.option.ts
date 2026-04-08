import { PresentacionOuput } from "./presentacion.output";


export class PresentacionOption {
    id: number;
    productoId: number;
    nombre: string;
    precioVenta: number;

    constructor(
        id: number,
        productoId: number,
        nombre: string,
        precioVenta: number,
    ) {
        this.id = id;
        this.productoId = productoId;
        this.nombre = nombre;
        this.precioVenta = precioVenta;
    }

    public static getInstance(): PresentacionOption {
        return new PresentacionOption(0, 0, 'Selecione Producto', 0);
    }

    public static getInstanceFromOutput(presentacion: PresentacionOuput): PresentacionOption {
        return new PresentacionOption(
            presentacion.id,
            presentacion.productoId,
            `${presentacion.marca} - ${presentacion.presentacion}`,
            presentacion.precioVenta
        );
    }

}
