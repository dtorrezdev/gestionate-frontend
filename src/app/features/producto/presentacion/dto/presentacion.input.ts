
export interface PresentacionInput {
    productoId: number;
    nombre: string;
    concepto: string;
    descripcion: string;
    unidadMedidaId: number;
    esUnidadMinima: boolean;
    factorConversion: number;
    precioUnitario: number;
    precioVenta: number;
    marcaId: number;
    cantidadDisponibleStock: number;
    cantidadMinimoStock: number;
    diasAntesExpiracion: number;
}
