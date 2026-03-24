export interface VentaInput {
    total: number;
    codigo: string;
    glosa?: string;
    clienteId: number;
    estado: string;
    movimientoId?: number;
    detalle: Detalle[];
}

export interface Detalle {
    presentacionId: number;
    productoId: number;
    cantidad: number;
    cantidadBase: number;
    precioUnitario: number;
}
