import { DetalleVenta } from "../../../venta/venta/dto/venta.input";


export interface CompraOutput {
    id: number;
    codigo: string;
    glosa: string;
    total: number;
    fechaRegistro?: Date;
    fechaCompra: Date;
    fechaSolicitud: Date;
    cliente?: string;
    proveedor?: string;
    proveedorId: number;
    estado: string;
    clienteId: number;
    nroItems: number;
    movimientoId?: number;
    detalles: DetalleVenta[];
}
