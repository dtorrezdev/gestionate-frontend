
export interface VentaOutput {
    id: number;
    codigo: string;
    glosa: string;
    total: number;
    fechaRegistro: Date;
    cliente: string;
    estado: string;
    movimientoId: number;
    clienteId: number;
}
