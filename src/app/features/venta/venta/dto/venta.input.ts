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
    productoId: number;
    cantidad: number;
    cantidadBase: number;
    precioUnitario: number;
    subtotal?: number;
}
