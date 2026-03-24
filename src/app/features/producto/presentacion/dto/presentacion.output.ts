
export class PresentacionOuput {
    id: number;
    productoId: number;
    nombre: string;
    concepto: string;
    descripcion: string;
    unidadMedidaId: number;
    hasUnidadBase: boolean;
    factorConversion: number;
    precioRef: number;
    precioVenta: number;
    precioXMayor: number;
    marcaId: number;

    constructor(
        id: number,
        productoId: number,
        nombre: string,
        concepto: string,
        descripcion: string,
        unidadMedidaId: number,
        hasUnidadBase: boolean,
        factorConversion: number,
        precioRef: number,
        precioVenta: number,
        precioXMayor: number,
        marcaId: number
    ) {

        this.id = id;
        this.productoId = productoId;
        this.nombre = nombre;
        this.concepto = concepto;
        this.descripcion = descripcion;
        this.unidadMedidaId = unidadMedidaId;
        this.hasUnidadBase = hasUnidadBase;
        this.factorConversion = factorConversion;
        this.precioRef = precioRef;
        this.precioVenta = precioVenta;
        this.precioXMayor = precioXMayor;
        this.marcaId = marcaId;

    }

    public static getInstance(): PresentacionOuput {
        return new PresentacionOuput(0, 0, '', '', '', 0, false, 0, 0, 0, 0, 0);
    }

}
