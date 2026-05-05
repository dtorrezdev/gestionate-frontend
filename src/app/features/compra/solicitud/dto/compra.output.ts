import { PagoOutput } from "../../../venta/pago/dto/pago.output";
import { DetalleVenta } from "../../../venta/venta/dto/venta.input";


export interface CompraOutput {
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
