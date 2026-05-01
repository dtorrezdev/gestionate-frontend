import { StockByProductoOutput } from "./stock-by-producto.output";


export interface ProductoStockOutput {
    id: number;
    productoId: number;
    presentacion: string;
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
    marca: string;
    estadoStock: string;
    stocks?: StockByProductoOutput[];
}
