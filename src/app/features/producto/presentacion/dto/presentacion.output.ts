
export class PresentacionOuput {
    id: number;
    productoId: number;
    nombre: string;
    concepto: string;
    descripcion: string;
    unidadMedidaId: number;
    esUnidadMinima: boolean;
    factorConversion: number;
    precioUnitario: number;
    precioVenta: number;
    cantidadMinimoStock: number;
    cantidadDisponibleStock: number;
    diasAntesExpiracion: number;
    marcaId: number;

    constructor(
        id: number,
        productoId: number,
        nombre: string,
        concepto: string,
        descripcion: string,
        unidadMedidaId: number,
        esUnidadMinima: boolean,
        factorConversion: number,
        precioUnitario: number,
        precioVenta: number,
        cantidadMinimoStock: number,
        cantidadDisponibleStock: number,
        diasAntesExpiracion: number,
        marcaId: number
    ) {
        this.id = id;
        this.productoId = productoId;
        this.nombre = nombre;
        this.concepto = concepto;
        this.descripcion = descripcion;
        this.unidadMedidaId = unidadMedidaId;
        this.esUnidadMinima = esUnidadMinima;
        this.factorConversion = factorConversion;
        this.precioUnitario = precioUnitario;
        this.precioVenta = precioVenta;
        this.cantidadDisponibleStock = cantidadDisponibleStock;
        this.cantidadMinimoStock = cantidadMinimoStock;
        this.diasAntesExpiracion = diasAntesExpiracion;
        this.marcaId = marcaId;
    }

    public static getInstance(): PresentacionOuput {
        return new PresentacionOuput(0, 0, '', '', '', 0, false, 0, 0, 0, 0, 0, 0, 0);
    }

}
