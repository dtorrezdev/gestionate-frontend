import { PagoOutput } from "../../pago/dto/pago.output";
import { DetalleVenta } from "./venta.input";

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
    detalle?: DetalleVenta[],
    pagos?: PagoOutput[]
}
