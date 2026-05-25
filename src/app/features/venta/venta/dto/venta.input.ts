export interface VentaInput {
    total: number;
    codigo: string;
    glosa?: string;
    clienteId: number;
    estado: string;
    detalle: DetalleVenta[];
}

export interface DetalleVenta {
    presentacionId: number;
    nombre?: string;
    productoId: number;
    cantidad: number;
    precio: number;
    subtotal: number;
}
