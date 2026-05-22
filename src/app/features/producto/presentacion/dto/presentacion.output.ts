
export class PresentacionOuput {
    id: number;
    productoId: number;
    presentacion: string;
    concepto: string;
    descripcion: string;
    unidadMedidaId: number;
    esUnidadMinima: boolean;
    precioUnitario: number;
    precioVenta: number;
    cantidadMinimoStock: number;
    cantidadDisponibleStock: number;
    diasAntesExpiracion: number;
    marcaId: number;
    marca: string;
    estadoStock: string;
    seControlaStock: boolean;
    nombre: string;

    constructor(
        id: number,
        productoId: number,
        presentacion: string,
        concepto: string,
        descripcion: string,
        unidadMedidaId: number,
        esUnidadMinima: boolean,
        precioUnitario: number,
        precioVenta: number,
        cantidadMinimoStock: number,
        cantidadDisponibleStock: number,
        diasAntesExpiracion: number,
        marcaId: number,
        marca: string,
        estadoStock: string,
        seControlaStock: boolean,
        nombre: string
    ) {
        this.id = id;
        this.productoId = productoId;
        this.presentacion = presentacion;
        this.concepto = concepto;
        this.descripcion = descripcion;
        this.unidadMedidaId = unidadMedidaId;
        this.esUnidadMinima = esUnidadMinima;
        this.precioUnitario = precioUnitario;
        this.precioVenta = precioVenta;
        this.cantidadDisponibleStock = cantidadDisponibleStock;
        this.cantidadMinimoStock = cantidadMinimoStock;
        this.diasAntesExpiracion = diasAntesExpiracion;
        this.marcaId = marcaId;
        this.marca = marca;
        this.estadoStock = estadoStock;
        this.seControlaStock = seControlaStock;
        this.nombre = nombre;
    }

    public static getInstance(): PresentacionOuput {
        return new PresentacionOuput(0, 0, '', '', '', 0, false, 0, 0, 0, 0, 0, 0, '', '', false, '');
    }

}
