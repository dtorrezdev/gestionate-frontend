

export interface MovimientoInput {
    tipoMovimientoId: number;
    motivo: string;
    productoId: number;
    presentacionId: number;
    ubicacionStockId: number;
    detalleMovimiento: DetalleMovimiento[];
}

export interface DetalleMovimiento {
    lote: string;
    fechaExpiracion: Date;
    cantidadStock: string;
    cantidadStockBase: string;
    registroSanitario: string;
}
